import { useMyAccount } from '@/stores/my-account'
import { Signer } from '@/utils/account'
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { signMessage } from './crypto'
import {
  newAddMessageRequest,
  newGetMessagesRequest,
  newSetRoomsRequest,
} from './requests'
import { ChatMessage, RoomId, SignedChatMessage } from './types'

type SendSetRoomsRequestFn = (roomIds: RoomId[]) => void
type SendGetMessagesRequestFn = (roomId: RoomId) => void
type SendAddMessageRequestFn = (unsignedMessage: ChatMessage) => void

type WsChatContextValue = {
  sendSetRoomsRequest: SendSetRoomsRequestFn
  sendGetMessagesRequest: SendGetMessagesRequestFn
  sendAddMessageRequest: SendAddMessageRequestFn
}

function dummyFn(): void {
  console.log('This is a dummy function. WsChatContext is not initialized yet')
}

const DummyContextValue: WsChatContextValue = {
  sendSetRoomsRequest: dummyFn,
  sendGetMessagesRequest: dummyFn,
  sendAddMessageRequest: dummyFn,
}

const WsChatContext = createContext<WsChatContextValue>(DummyContextValue)

function setUpWebSocket(): WebSocket {
  // TODO Should use a secure protocol wss://
  // let url = `wws://localhost:2000/chat`
  let url = `ws://localhost:2000/chat`
  let ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    console.log('Connected to the chat server')
    console.log('Web socket object:', ws)

    // TODO comment out this example
    ws.send(
      JSON.stringify({
        action: 'SetRooms',
        // payload: { roomIds: ['T', 'E', 'S', 'T'] }
        payload: { roomIds: ['1'] },
      })
    )
  })

  ws.addEventListener('message', (event) => {
    console.log(`Received a message from the chat server: ${event.data}`)
  })

  ws.addEventListener('error', (err) => {
    console.log(`Unexpected error: ${err}`)
  })

  ws.addEventListener('close', () => {
    console.log('Connection closed')
  })

  return ws
}

function newContextValue(
  socket: WebSocket,
  signer: Signer | null
): WsChatContextValue {
  const sendChatRequest = (message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message)
    }
  }

  const sendSetRoomsRequest: SendSetRoomsRequestFn = (roomIds) => {
    const req = newSetRoomsRequest({ roomIds })
    sendChatRequest(req)
  }

  const sendGetMessagesRequest: SendGetMessagesRequestFn = (roomId) => {
    const req = newGetMessagesRequest({ roomIds: [roomId] })
    sendChatRequest(req)
  }

  const sendAddMessageRequest: SendAddMessageRequestFn = (unsignedMessage) => {
    if (!signer) {
      console.error('Cannot sign a message: signer in undefined')
      return
    }

    const signature = signMessage(signer, unsignedMessage).toLocaleString()
    const signedMessage: SignedChatMessage = {
      account: signer.address,
      message: unsignedMessage,
      signature,
    }

    const req = newAddMessageRequest(signedMessage)
    sendChatRequest(req)
  }

  const ctxValue = {
    sendSetRoomsRequest,
    sendGetMessagesRequest,
    sendAddMessageRequest,
  }

  return ctxValue
}

function isObjectDefined<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined
}

/** Provides a context with functions to send requests to the chat server. */
const WsChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket>()
  const signer = useMyAccount((state) => state.signer)
  const isSignerDefined = isObjectDefined(signer)

  useEffect(() => {
    if (!isSignerDefined) {
      return
    }

    const ws = setUpWebSocket()
    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [isSignerDefined])

  const ctxValue = socket ? newContextValue(socket, signer) : DummyContextValue

  return (
    <WsChatContext.Provider value={ctxValue}>{children}</WsChatContext.Provider>
  )
}

const useWsChat = () => {
  return useContext(WsChatContext)
}

export { WsChatProvider, useWsChat }

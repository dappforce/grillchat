import { Component } from 'react'
import Button from './Button'
import Logo from './Logo'

export default class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='flex h-screen w-full items-center justify-center bg-background px-8 text-center'>
          <div className='flex flex-col gap-4'>
            <Logo className='text-5xl' />
            <p className='text-2xl'>Oops, something went wrong 🥲</p>
            <Button
              onClick={() => {
                window.location.href = '/tg'
              }}
              size='lg'
            >
              Back to home
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

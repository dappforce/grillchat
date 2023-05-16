# How to Integrate [Grill.chat](http://grill.chat/) to your app 🤝

There are currently two options that you can use to integrate [Grill.chat](http://grill.chat/):

1. Using [Grill Widget](#grill-widget) (NPM Package / CDN)
2. Using [Iframe Integration](#iframe-integration)

## Grill Widget

Grill Widget is a tiny package that you can use to integrate Grill.chat to your app. It wraps all the config available in a simple function call.

### Installation

```bash
yarn add @subsocial/grill-widget
```

or using cdn

```html
<script src="https://unpkg.com/@subsocial/grill-widget" defer></script>
<!-- this script will expose `GRILL` variable to window.  -->
```

### Usage

1. Add div with id of `grill` to your app
2. Call `grill.init()` with config (config is optional)

   a) Use as a JS/TS module

   ```js
   import grill from '@subsocial/grill-widget'
   grill.init(config)
   ```

   b) Use as a global variable (CDN)

   ```js
   window.GRILL.init(config)
   ```

3. That's it 🥳!

### Config Options

| Name              | Type                                               | Description                                                                                                                                        |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widgetElementId` | `string`                                           | The `id` of the div that you want to render the chat to. Default to `grill`                                                                        |
| `hub`             | `{ id: string }`                                   | The `id` or the `domain name` of the space that you want to show the topics from. Default to `{ id: 'x' }` (grill.chat home page)                  |
| `channel`         | `Channel`                                          | Option to make the iframe open chat room (a channel) directly. Read more about this option [here](#channel-option)                                 |
| `order`           | `string[]`                                         | The order of the topics (using post ids). e.g. `['1001', '1002']` if the post id exist in the space, it will be sorted based on the order provided |
| `theme`           | `string`                                           | The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.chat>                            |
| `customizeIframe` | `(iframe: HTMLIFrameElement) => HTMLIFrameElement` | A function that will be called when the iframe is created. You can use this to customize the iframe attributes.                                    |

#### Channel Option

Channel option is used to make the iframe open chat room (a channel) directly. This is useful if you want to have a specific topic for your user to discuss.

This channel accepts `Channel` type:

```ts
type Channel = {
  type: 'channel'
  id: string
  settings: ChannelSettings
}
```

| Name       | Type              | Description                                                                          |
| ---------- | ----------------- | ------------------------------------------------------------------------------------ |
| `type`     | `'channel'`       | The type of the channel. This should be set to `'channel'`                           |
| `id`       | `string`          | The id of the channel. This should be the post id of the topic that you want to open |
| `settings` | `ChannelSettings` | The settings of the channel. Read more about this [here](#channel-settings)          |

##### Channel Settings

Channel settings is used to customize the channel iframe. Below includes the list of settings that you can use to customize the channel.
| Name | Type | Description |
| ---- | ---- | ----------- |
| `enableBackButton` | `boolean` | If set to `true`, it will show the back button in the channel iframe. Default to `false` |
| `enableLoginButton` | `boolean` | If set to `true`, it will show the login button in the channel iframe. Default to `false` |
| `autoFocus` | `boolean` | If set to `true`, it will focus the input when the iframe is loaded. The default behavior is `on`, except on touch devices. If set `true` or `false`, it will unify behavior on touch and non-touch devices. |

## Iframe Integration

The easiest way to integrate Grill.chat to your app is to use the iframe integration. It's a simple HTML tag that you can add to your app, and it will render the chat in an iframe.

### 1. Add Iframe tag to your app

Add the following HTML tag to your app, where you want to render the chat and style it however you want.

```html
<iframe allow="clipboard-write" src="https://x.grill.chat"></iframe>
```

### 2. Customize the `src` link

The `src` link can be customized to your needs. Below includes the list of options that you can use to customize the chat.

#### 2.1. Space Options

Grill.chat home page contains list of topics for user to choose from. This topics are listed from all the posts in a subsocial space. You can create space in xSocial chain using [Gazer](https://x.gazer.app/)

For example, if you create a space with ID `1002`, then you can set the iframe `src` to `https://grill.chat/1002` to only show topics from that space.

#### 2.2. Page Options

Grill.chat has 2 pages that can be the start point.

1. Home page

   It contains all of the topics in a subsocial space that you set in the `src` link. You can read more in [Space Options](#21-space-options).

   ```
   https://grill.chat/[spaceId]
   ```

2. Chat Page

   You can also choose to have your user automatically opens a chat room. This is useful if you want to have a specific topic for your user to discuss. You can hide the back button in chat room by using [`isChatRoomOnly` option](#23-other-options)

   ```
   https://grill.chat/[spaceId]/[topicId]
   ```

#### 2.3. Other options

You can also customize the `src` link with query parameters. Below includes the list of query parameters that you can use to customize the chat.
generate table

| Name           | Description                                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| theme          | Theme of the chat. Available options: `light` or `dark`. If not provided, it will use user's system preferences or his last selected theme when accessed Grill.chat                                                |
| order          | Specifies the order of the chat in home page. Pass multiple topic ids in `order` separated by comma. The other chats will be ordered based on last message                                                         |
| isChatRoomOnly | If set to `true` or `1`, it will hide the back button in chat page. This should be used alongside [Page Options](#22-page-options), to set the iframe to chat page directly and set the iframe to only 1 chat room |

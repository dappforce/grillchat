# Grill Widget

Grill Widget is a tiny package (< 1kb compressed) that you can use to integrate [Grill.chat](https://grill.chat) to your app. It wraps all the config available in a simple function call.

## Installation

```bash
yarn add @subsocial/grill-widget
```

or using CDN

```html
<script src="https://unpkg.com/@subsocial/grill-widget" defer></script>
<!-- this script will expose `GRILL` variable to window.  -->
```

## Usage

1. Add the div HTML tag with an id of `grill` to your app. Example:

   ```html
   <div id="grill"></div>
   ```

2. Call `grill.init(config)`. The [config](#customization) is optional. Example:

   a) Use as a JS/TS module

   ```js
   import grill from '@subsocial/grill-widget'

   const config = {}
   grill.init(config)
   ```

   b) Use as a global variable (CDN)

   ```js
   const config = {}
   window.GRILL.init(config)
   ```

3. That's it 🥳!

## Customization

You can customize a Grill UI by passing a config object to `grill.init()` function. For example:

```ts
import grill from '@subsocial/grill-widget'
grill.init({
  theme: 'light',
  // other options...
})
```

All config options are optional. If you don't pass any config, it will use the default config.

| Name              | Type                                               | Description                                                                                                                                                                                                                                                             |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widgetElementId` | `string`                                           | The `id` of the div that you want to render the chat to. Default to `grill`                                                                                                                                                                                             |
| `hub`             | `{ id: string }`                                   | The `id` or the `domain name` of the space that you want to show the topics from. You can read on how to [manage your space here](https://github.com/dappforce/grillchat/blob/main/README.md#how-to-manage-your-space). Default to `{ id: 'x' }` (grill.chat home page) |
| `channel`         | [`Channel`](#channel-option)                       | Option to make the iframe open chat room (a channel) directly. Read more about this option [here](#channel-option)                                                                                                                                                      |
| `theme`           | `'light' or 'dark'`                                | The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.chat>                                                                                                                                                 |
| `onWidgetCreated` | `(iframe: HTMLIFrameElement) => HTMLIFrameElement` | A function that will be called when the iframe is created. You can use this to customize the iframe attributes.                                                                                                                                                         |

### Channel Option

Channel option is used to make the iframe open chat room (a channel) directly. This is useful if you want to have a specific topic for your user to discuss.

| Name       | Type                                   | Description                                                                                                                |
| ---------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `type`     | `'channel'` &#124; `'resource'`        | The type of the channel. Check options for [channel](#type-channel-options) and [resource](#type-resource-options) bellow. |
| `settings` | [`ChannelSettings`](#channel-settings) | The settings of the channel. Read more about this [here](#channel-settings)                                                |

#### Type `'channel'` Options

The type opens static chat room by id

| Name | Type     | Description                                                                             |
| ---- | -------- | --------------------------------------------------------------------------------------- |
| `id` | `string` | The id of the channel. This should be the channel id of the topic that you want to open |

#### Type `'resource'` Options

The type creates new or opens existed chat room by resource.

| Name       | Type                     | Description                                                                                                                                                                                |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | `SocialResource`         | The resource that will be linked to the postId in the blockchain should be the SocialResource. You can find examples suitable for various scenarios [here](#resource-discussion-examples). |
| `metadata` | `{ title, body, image }` | The metadata will be used as the content for the discussion post within the blockchain.                                                                                                    |

> **Warning**
>
> To use the type, install the package via:
>
> `yarn add @subsocial/resource-discussions`
>
> Then, use `SocialResource` for the `resource` parameter, like [here](#resource-discussion-examples).

#### Channel Settings

You can customize the look and feel of Grill UI via channel settings.

| Name                   | Type      | Description                                                                                                                                                                                             |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enableBackButton`     | `boolean` | If set to `true`, it will show the back button in the channel iframe. Default to `false`                                                                                                                |
| `enableLoginButton`    | `boolean` | If set to `true`, it will show the login button in the channel iframe. Default to `false`                                                                                                               |
| `enableInputAutofocus` | `boolean` | If set to `true`, it will autofocus on the message input when the iframe is loaded. The default behavior is `true`, except on touch devices. If set `true`, it will autofocus the input on all devices. |

### Examples

#### Hub config

```ts
const config = {
  hub: { id: '1002' },
  theme: 'light',
}
```

#### Full Channel Config with `'type': 'channel'`

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: '1002' },
  channel: {
    type: 'channel',
    id: '2673',
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
  },
  theme: 'light',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

#### Resource Discussion Examples

##### Full Resource Config with `'type': 'resource'`

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: '1002' },
  channel: {
    type: 'resource',
    resource: new SocialResource({
      schema: 'social',
      app: 'twitter',
      resourceType: 'profile',
      resourceValue: { id: 'elonmusk' },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
  },
  theme: 'light',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

##### SocialResource Examples

1. EVM account address on Ethereum

```ts
new SocialResource({
  schema: 'chain',
  chainType: 'evm',
  chainName: 'ethereum',
  resourceType: 'account',
  resourceValue: {
    accountAddress: '0x0000000000000000000000000',
  },
})
```

2. NFT on Polygon

```ts
new SocialResource({
  schema: 'chain',
  chainType: 'evm',
  chainName: 'polygon',
  resourceType: 'nft',
  resourceValue: {
    nftStandart: 'ERC-721',
    collectionId: '0x0000000000000000000000000',
    tokenId: '112',
  },
})
```

3. Block on Kusama

```ts
new SocialResource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'block',
  resourceValue: {
    blockNumber: '1',
  },
})
```

4. Elon Mask Twitter profile

```ts
new SocialResource({
  schema: 'social',
  app: 'twitter',
  resourceType: 'profile',
  resourceValue: { id: 'elonmusk' },
})
```

5. Youtube video

```ts
new SocialResource({
  schema: 'social',
  app: 'youtube',
  resourceType: 'post',
  resourceValue: { id: '58QuLi9ff9g' },
})
```

6. RMRK2 NFT on Kusama

```ts
new SocialResource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'nft',
  resourceValue: {
    nftStandart: 'rmrk2',
    collectionId: '22708b368d163c8007',
    tokenId: '00000020',
  },
})
```

7. Zeitgeist Market

```ts
new SocialResource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'zeitgeist',
  resourceType: 'market',
  resourceValue: {
    id: '111',
  },
})
```

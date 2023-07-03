# Grill Widget

Grill Widget is a tiny package (< 1kb compressed) that you can use to integrate [Grill.chat](https://grill.chat) into your app. It wraps all of the available configs in a simple function call.

## Installation

```bash
yarn add @subsocial/grill-widget
```

or using CDN

```html
<script src="https://unpkg.com/@subsocial/grill-widget@latest" defer></script>
<!-- You can change which specific version you want to use by changing the `@latest` to a specific version number. For example: `@0.0.8`. -->
<!-- this script will expose the `GRILL` variable to the window.  -->
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

3. That's it! 🥳

## Customization

You can customize the Grill UI by passing a config object to the `grill.init()` function. For example:

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
| `theme`           | `'light' or 'dark'`                                | The theme of the chat. If omitted, it will use the system preferences or the last <https://grill.chat> theme selected by the user.                                                                                                                                      |
| `onWidgetCreated` | `(iframe: HTMLIFrameElement) => HTMLIFrameElement` | A function that will be called when the iframe is created. You can use this to customize the iframe attributes.                                                                                                                                                         |

### Channel Option

The channel option is used to make the iframe open a chat room (a channel) directly. This is useful if you want to have a specific topic for your user to discuss.

| Name       | Type                                   | Description                                                                                                              |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `type`     | `'channel'` &#124; `'resource'`        | The channel type. Check the options for [channels](#type-channel-options) and [resources](#type-resource-options) below. |
| `settings` | [`ChannelSettings`](#channel-settings) | The settings of the channel. Read more about this [here](#channel-settings).                                             |

#### Type `'channel'` Options

This type opens a static chat room by id.

| Name | Type     | Description                                                                              |
| ---- | -------- | ---------------------------------------------------------------------------------------- |
| `id` | `string` | The id of the channel. This should be the channel id of the topic that you want to open. |

#### Type `'resource'` Options

This type creates a new, or opens an existing, chat room by resource.

| Name       | Type                     | Description                                                                                                                                                             |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resource` | `Resource`               | The resource linked to the postId on the blockchain should be the Resource. You can find examples suitable for various scenarios [here](#resource-discussion-examples). |
| `metadata` | `{ title, body, image }` | The metadata will be used as the content for the discussion post on the blockchain.                                                                                     |

> **Warning**
>
> To use this type, install the package via:
>
> `yarn add @subsocial/resource-discussions`
>
> Then, use `Resource` for the `resource` parameter, like [here](#resource-discussion-examples).

#### Channel Settings

You can customize the look and feel of the Grill UI via channel settings.

| Name                   | Type      | Description                                                                                                                                                                                                |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enableBackButton`     | `boolean` | If set to `true`, it will show the back button in the channel iframe. Default to `false`                                                                                                                   |
| `enableLoginButton`    | `boolean` | If set to `true`, it will show the login button in the channel iframe. Defaults to `false`.                                                                                                                |
| `enableInputAutofocus` | `boolean` | If set to `true`, it will autofocus on the message input when the iframe is loaded. The default behavior is `true`, except on touch devices. If set to `true`, it will autofocus the input on all devices. |

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
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
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
    metadata: {
      title: 'Elon Musk',
      body: 'Onchain discussion about Elon Musk',
    },
  },
  theme: 'light',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

#### Resource config structure

The resource config has a conditional structure, which means that each subsequent config value
depends on the previous one through a config hierarchy. You can envision this hierarchy as
a directed graph tree with a variety of values and a strict config structure.
There are various supported combinations of config values. On the other hand,
you can provide your own values. However, in that case, your resource config will
only have a basic list of resourceValue properties.

<details>
  <summary>In this list, you can find all of the currently supported config value conditions.</summary>
   <blockquote>
   <details><summary>schema: social</summary>

- `social -> twitter -> post -> id`;
- `social -> twitter -> profile -> id`;

---

- `social -> youtube -> post -> id`;
- `social -> youtube -> profile -> id`;

---

- `social -> any_social_app -> post -> id`;
- `social -> any_social_app -> profile -> id`;

  </details>
  </blockquote>

<blockquote>
   <details><summary>schema: chain</summary>

#### Any chain type -> any chain name

- `chain -> any_chainType -> any_chainType_any_chainName -> block -> blockNumber`;
- `chain -> any_chainType -> any_chainType_any_chainName -> tx -> txHash`;
- `chain -> any_chainType -> any_chainType_any_chainName -> token -> tokenAddress`;
- `chain -> any_chainType -> any_chainType_any_chainName -> account`;

#### EVM chain type

- `chain -> evm -> ethereum -> block -> blockNumber`;
- `chain -> evm -> ethereum -> tx -> txHash`;
- `chain -> evm -> ethereum -> token -> tokenAddress`;
- `chain -> evm -> ethereum -> nft -> collectionId`;
- `chain -> evm -> ethereum -> nft -> nftId`;
- `chain -> evm -> ethereum -> nft -> standard`;

---

- `chain -> evm -> any_evm_chainName -> block -> blockNumber`;
- `chain -> evm -> any_evm_chainName -> tx -> txHash`;
- `chain -> evm -> any_evm_chainName -> token -> tokenAddress`;
- `chain -> evm -> any_evm_chainName -> account`;
- `chain -> evm -> any_evm_chainName -> nft -> collectionId`;
- `chain -> evm -> any_evm_chainName -> nft -> nftId`;
- `chain -> evm -> any_evm_chainName -> nft -> standard`;

#### Substrate chain type

- `chain -> substrate -> subsocial -> block -> blockNumber`;
- `chain -> substrate -> subsocial -> tx -> txHash`;
- `chain -> substrate -> subsocial -> token -> tokenAddress`;
- `chain -> substrate -> subsocial -> nft -> collectionId`;
- `chain -> substrate -> subsocial -> nft -> nftId`;
- `chain -> substrate -> subsocial -> nft -> standard`;
- `chain -> substrate -> subsocial -> proposal -> id`;

---

- `chain -> substrate -> zeitgeist -> block -> blockNumber`;
- `chain -> substrate -> zeitgeist -> tx -> txHash`;
- `chain -> substrate -> zeitgeist -> token -> tokenAddress`;
- `chain -> substrate -> zeitgeist -> nft -> collectionId`;
- `chain -> substrate -> zeitgeist -> nft -> nftId`;
- `chain -> substrate -> zeitgeist -> nft -> standard`;
- `chain -> substrate -> zeitgeist -> proposal -> id`;
- `chain -> substrate -> zeitgeist -> market -> id`;

---

- `chain -> substrate -> any_substrate_chainName -> block -> blockNumber`;
- `chain -> substrate -> any_substrate_chainName -> tx -> txHash`;
- `chain -> substrate -> any_substrate_chainName -> token -> tokenAddress`;
- `chain -> substrate -> any_substrate_chainName -> account`;

  </details>
  </blockquote>

</details>

#### Resource Examples

##### 1. EVM account address on Ethereum

```ts
new Resource({
  schema: 'chain',
  chainType: 'evm',
  chainName: 'ethereum',
  resourceType: 'account',
  resourceValue: {
    accountAddress: '0x0000000000000000000000000',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'evm',
      chainName: 'ethereum',
      resourceType: 'account',
      resourceValue: {
        accountAddress: '0x0000000000000000000000000',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Ethereum account',
      body: '...',
      image: '',
    },
  },
  theme: 'light',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 2. NFT on Polygon

```ts
new Resource({
  schema: 'chain',
  chainType: 'evm',
  chainName: 'polygon',
  resourceType: 'nft',
  resourceValue: {
    standard: 'ERC-721',
    collectionId: '0x0000000000000000000000000',
    tokenId: '112',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'evm',
      chainName: 'polygon',
      resourceType: 'nft',
      resourceValue: {
        standard: 'ERC-721',
        collectionId: '0x0000000000000000000000000',
        tokenId: '112',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'ERC-721 NFT on Polygon',
      body: '...',
      image: '',
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 3. Block on Kusama

```ts
new Resource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'block',
  resourceValue: {
    blockNumber: '1',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'substrate',
      chainName: 'kusama',
      resourceType: 'block',
      resourceValue: {
        blockNumber: '1',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Block #1 on Kusama',
      body: '...',
      image: '',
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 4. Elon Musk Twitter profile

```ts
new Resource({
  schema: 'social',
  app: 'twitter',
  resourceType: 'profile',
  resourceValue: { id: 'elonmusk' },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
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
    metadata: {
      title: 'Elon Musk Twitter profile',
      body: '...',
      image: '',
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 5. Youtube video

```ts
new Resource({
  schema: 'social',
  app: 'youtube',
  resourceType: 'post',
  resourceValue: { id: '58QuLi9ff9g' },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'social',
      app: 'youtube',
      resourceType: 'post',
      resourceValue: { id: '58QuLi9ff9g' },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Youtube video title',
      body: '...',
      image: '',
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 6. RMRK2 NFT on Kusama

```ts
new Resource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'nft',
  resourceValue: {
    standard: 'rmrk2',
    collectionId: '22708b368d163c8007',
    tokenId: '00000020',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'substrate',
      chainName: 'kusama',
      resourceType: 'nft',
      resourceValue: {
        standard: 'rmrk2',
        collectionId: '22708b368d163c8007',
        tokenId: '00000020',
      },
    })
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'RMRK2 NFT on Kusama',
      body: '...',
      image: ''
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 7. Zeitgeist Market

```ts
new Resource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'zeitgeist',
  resourceType: 'market',
  resourceValue: {
    id: '111',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'substrate',
      chainName: 'zeitgeist',
      resourceType: 'market',
      resourceValue: {
        id: '111',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Zeitgeist Market #111',
      body: '...',
      image: '',
    },
  },
  theme: 'dark',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

##### 8. Kusama Proposal

```ts
new Resource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'proposal',
  resourceValue: {
    id: '1',
  },
})
```

<details>
  <summary>Full config example</summary>

```ts
const config = {
  widgetElementId: 'grill',
  hub: { id: 'YOUR-HUB_ID' },
  channel: {
    type: 'resource',
    resource: new Resource({
      schema: 'chain',
      chainType: 'substrate',
      chainName: 'kusama',
      resourceType: 'proposal',
      resourceValue: {
        id: '1',
      },
    }),
    settings: {
      enableBackButton: false,
      enableLoginButton: false,
      enableInputAutofocus: true,
    },
    metadata: {
      title: 'Proposal #1 on Kusama',
      body: '...',
      image: '',
    },
  },
  theme: 'light',
  onWidgetCreated: (iframe) => {
    iframe.classList.add('my-custom-class')
    return iframe
  },
}
```

</details>

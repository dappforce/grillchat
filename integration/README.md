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

| Name       | Type                     | Description                                                                                                                                                                          |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | `Resource`               | The resource that will be linked to the postId in the blockchain should be the Resource. You can find examples suitable for various scenarios [here](#resource-discussion-examples). |
| `metadata` | `{ title, body, image }` | The metadata will be used as the content for the discussion post within the blockchain.                                                                                              |

> **Warning**
>
> To use the type, install the package via:
>
> `yarn add @subsocial/resource-discussions`
>
> Then, use `Resource` for the `resource` parameter, like [here](#resource-discussion-examples).

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

The resource config has a conditional structure, which means that each subsequent config value
depends on the previous one through a config hierarchy. You can envision this hierarchy as
a directed graph tree with a variety of values and a strict config structure.
There are various supported combinations of config values. On the other hand,
you can provide your own values. However, in such a case, your resource config will
only have a basic list of resourceValue properties.

<details>
  <summary>In this list, you can find all the currently supported config value conditions:</summary>

- `social -> twitter -> post -> id`;
- `social -> twitter -> profile -> id`;
- `social -> youtube -> post -> id`;
- `social -> youtube -> profile -> id`;
- `social -> medium -> post -> id`;
- `social -> medium -> profile -> id`;
- `social -> github -> post -> id`;
- `social -> github -> profile -> id`;
- `social -> reddit -> post -> id`;
- `social -> reddit -> profile -> id`;
- `social -> linkedin -> post -> id`;
- `social -> linkedin -> profile -> id`;
- `social -> any_social_app -> post -> id`;
- `social -> any_social_app -> profile -> id`;
- `chain -> any_chainType -> any_chainType_any_chainName -> block -> blockNumber`;
- `chain -> any_chainType -> any_chainType_any_chainName -> tx -> txHash`;
- `chain -> any_chainType -> any_chainType_any_chainName -> token -> tokenAddress`;
- `chain -> any_chainType -> any_chainType_any_chainName -> account`;
- `chain -> evm -> ethereum -> block -> blockNumber`;
- `chain -> evm -> ethereum -> tx -> txHash`;
- `chain -> evm -> ethereum -> token -> tokenAddress`;
- `chain -> evm -> ethereum -> nft -> collectionId`;
- `chain -> evm -> ethereum -> nft -> nftId`;
- `chain -> evm -> ethereum -> nft -> standard`;
- `chain -> evm -> bsc -> block -> blockNumber`;
- `chain -> evm -> bsc -> tx -> txHash`;
- `chain -> evm -> bsc -> token -> tokenAddress`;
- `chain -> evm -> bsc -> nft -> collectionId`;
- `chain -> evm -> bsc -> nft -> nftId`;
- `chain -> evm -> bsc -> nft -> standard`;
- `chain -> evm -> polygon -> block -> blockNumber`;
- `chain -> evm -> polygon -> tx -> txHash`;
- `chain -> evm -> polygon -> token -> tokenAddress`;
- `chain -> evm -> polygon -> nft -> collectionId`;
- `chain -> evm -> polygon -> nft -> nftId`;
- `chain -> evm -> polygon -> nft -> standard`;
- `chain -> evm -> avalanche -> block -> blockNumber`;
- `chain -> evm -> avalanche -> tx -> txHash`;
- `chain -> evm -> avalanche -> token -> tokenAddress`;
- `chain -> evm -> avalanche -> nft -> collectionId`;
- `chain -> evm -> avalanche -> nft -> nftId`;
- `chain -> evm -> avalanche -> nft -> standard`;
- `chain -> evm -> fantom -> block -> blockNumber`;
- `chain -> evm -> fantom -> tx -> txHash`;
- `chain -> evm -> fantom -> token -> tokenAddress`;
- `chain -> evm -> fantom -> nft -> collectionId`;
- `chain -> evm -> fantom -> nft -> nftId`;
- `chain -> evm -> fantom -> nft -> standard`;
- `chain -> evm -> optimism -> block -> blockNumber`;
- `chain -> evm -> optimism -> tx -> txHash`;
- `chain -> evm -> optimism -> token -> tokenAddress`;
- `chain -> evm -> optimism -> nft -> collectionId`;
- `chain -> evm -> optimism -> nft -> nftId`;
- `chain -> evm -> optimism -> nft -> standard`;
- `chain -> evm -> any_evm_chainName -> block -> blockNumber`;
- `chain -> evm -> any_evm_chainName -> tx -> txHash`;
- `chain -> evm -> any_evm_chainName -> token -> tokenAddress`;
- `chain -> evm -> any_evm_chainName -> account`;
- `chain -> evm -> any_evm_chainName -> nft -> collectionId`;
- `chain -> evm -> any_evm_chainName -> nft -> nftId`;
- `chain -> evm -> any_evm_chainName -> nft -> standard`;
- `chain -> substrate -> subsocial -> block -> blockNumber`;
- `chain -> substrate -> subsocial -> tx -> txHash`;
- `chain -> substrate -> subsocial -> token -> tokenAddress`;
- `chain -> substrate -> subsocial -> nft -> collectionId`;
- `chain -> substrate -> subsocial -> nft -> nftId`;
- `chain -> substrate -> subsocial -> nft -> standard`;
- `chain -> substrate -> subsocial -> proposal -> id`;
- `chain -> substrate -> xsocial -> block -> blockNumber`;
- `chain -> substrate -> xsocial -> tx -> txHash`;
- `chain -> substrate -> xsocial -> token -> tokenAddress`;
- `chain -> substrate -> xsocial -> nft -> collectionId`;
- `chain -> substrate -> xsocial -> nft -> nftId`;
- `chain -> substrate -> xsocial -> nft -> standard`;
- `chain -> substrate -> xsocial -> proposal -> id`;
- `chain -> substrate -> soonsocial -> block -> blockNumber`;
- `chain -> substrate -> soonsocial -> tx -> txHash`;
- `chain -> substrate -> soonsocial -> token -> tokenAddress`;
- `chain -> substrate -> soonsocial -> nft -> collectionId`;
- `chain -> substrate -> soonsocial -> nft -> nftId`;
- `chain -> substrate -> soonsocial -> nft -> standard`;
- `chain -> substrate -> soonsocial -> proposal -> id`;
- `chain -> substrate -> polkadot -> block -> blockNumber`;
- `chain -> substrate -> polkadot -> tx -> txHash`;
- `chain -> substrate -> polkadot -> token -> tokenAddress`;
- `chain -> substrate -> polkadot -> nft -> collectionId`;
- `chain -> substrate -> polkadot -> nft -> nftId`;
- `chain -> substrate -> polkadot -> nft -> standard`;
- `chain -> substrate -> polkadot -> proposal -> id`;
- `chain -> substrate -> kusama -> block -> blockNumber`;
- `chain -> substrate -> kusama -> tx -> txHash`;
- `chain -> substrate -> kusama -> token -> tokenAddress`;
- `chain -> substrate -> kusama -> nft -> collectionId`;
- `chain -> substrate -> kusama -> nft -> nftId`;
- `chain -> substrate -> kusama -> nft -> standard`;
- `chain -> substrate -> kusama -> proposal -> id`;
- `chain -> substrate -> astar -> block -> blockNumber`;
- `chain -> substrate -> astar -> tx -> txHash`;
- `chain -> substrate -> astar -> token -> tokenAddress`;
- `chain -> substrate -> astar -> nft -> collectionId`;
- `chain -> substrate -> astar -> nft -> nftId`;
- `chain -> substrate -> astar -> nft -> standard`;
- `chain -> substrate -> astar -> proposal -> id`;
- `chain -> substrate -> zeitgeist -> block -> blockNumber`;
- `chain -> substrate -> zeitgeist -> tx -> txHash`;
- `chain -> substrate -> zeitgeist -> token -> tokenAddress`;
- `chain -> substrate -> zeitgeist -> nft -> collectionId`;
- `chain -> substrate -> zeitgeist -> nft -> nftId`;
- `chain -> substrate -> zeitgeist -> nft -> standard`;
- `chain -> substrate -> zeitgeist -> proposal -> id`;
- `chain -> substrate -> zeitgeist -> market -> id`;
- `chain -> substrate -> moonbeam -> block -> blockNumber`;
- `chain -> substrate -> moonbeam -> tx -> txHash`;
- `chain -> substrate -> moonbeam -> token -> tokenAddress`;
- `chain -> substrate -> moonbeam -> nft -> collectionId`;
- `chain -> substrate -> moonbeam -> nft -> nftId`;
- `chain -> substrate -> moonbeam -> nft -> standard`;
- `chain -> substrate -> moonbeam -> proposal -> id`;
- `chain -> substrate -> moonriver -> block -> blockNumber`;
- `chain -> substrate -> moonriver -> tx -> txHash`;
- `chain -> substrate -> moonriver -> token -> tokenAddress`;
- `chain -> substrate -> moonriver -> nft -> collectionId`;
- `chain -> substrate -> moonriver -> nft -> nftId`;
- `chain -> substrate -> moonriver -> nft -> standard`;
- `chain -> substrate -> moonriver -> proposal -> id`;
- `chain -> substrate -> crust -> block -> blockNumber`;
- `chain -> substrate -> crust -> tx -> txHash`;
- `chain -> substrate -> crust -> token -> tokenAddress`;
- `chain -> substrate -> crust -> nft -> collectionId`;
- `chain -> substrate -> crust -> nft -> nftId`;
- `chain -> substrate -> crust -> nft -> standard`;
- `chain -> substrate -> crust -> proposal -> id`;
- `chain -> substrate -> kilt -> block -> blockNumber`;
- `chain -> substrate -> kilt -> tx -> txHash`;
- `chain -> substrate -> kilt -> token -> tokenAddress`;
- `chain -> substrate -> kilt -> nft -> collectionId`;
- `chain -> substrate -> kilt -> nft -> nftId`;
- `chain -> substrate -> kilt -> nft -> standard`;
- `chain -> substrate -> kilt -> proposal -> id`;
- `chain -> substrate -> phala -> block -> blockNumber`;
- `chain -> substrate -> phala -> tx -> txHash`;
- `chain -> substrate -> phala -> token -> tokenAddress`;
- `chain -> substrate -> phala -> nft -> collectionId`;
- `chain -> substrate -> phala -> nft -> nftId`;
- `chain -> substrate -> phala -> nft -> standard`;
- `chain -> substrate -> phala -> proposal -> id`;
- `chain -> substrate -> hydradx -> block -> blockNumber`;
- `chain -> substrate -> hydradx -> tx -> txHash`;
- `chain -> substrate -> hydradx -> token -> tokenAddress`;
- `chain -> substrate -> hydradx -> nft -> collectionId`;
- `chain -> substrate -> hydradx -> nft -> nftId`;
- `chain -> substrate -> hydradx -> nft -> standard`;
- `chain -> substrate -> hydradx -> proposal -> id`;
- `chain -> substrate -> bifrost -> block -> blockNumber`;
- `chain -> substrate -> bifrost -> tx -> txHash`;
- `chain -> substrate -> bifrost -> token -> tokenAddress`;
- `chain -> substrate -> bifrost -> nft -> collectionId`;
- `chain -> substrate -> bifrost -> nft -> nftId`;
- `chain -> substrate -> bifrost -> nft -> standard`;
- `chain -> substrate -> bifrost -> proposal -> id`;
- `chain -> substrate -> statemint -> block -> blockNumber`;
- `chain -> substrate -> statemint -> tx -> txHash`;
- `chain -> substrate -> statemint -> token -> tokenAddress`;
- `chain -> substrate -> statemint -> nft -> collectionId`;
- `chain -> substrate -> statemint -> nft -> nftId`;
- `chain -> substrate -> statemint -> nft -> standard`;
- `chain -> substrate -> statemint -> proposal -> id`;
- `chain -> substrate -> any_substrate_chainName -> block -> blockNumber`;
- `chain -> substrate -> any_substrate_chainName -> tx -> txHash`;
- `chain -> substrate -> any_substrate_chainName -> token -> tokenAddress`;
- `chain -> substrate -> any_substrate_chainName -> account`;

</details>

##### Resource Examples

1. EVM account address on Ethereum

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

2. NFT on Polygon

```ts
new Resource({
  schema: 'chain',
  chainType: 'evm',
  chainName: 'polygon',
  resourceType: 'nft',
  resourceValue: {
    standart: 'ERC-721',
    collectionId: '0x0000000000000000000000000',
    tokenId: '112',
  },
})
```

3. Block on Kusama

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

4. Elon Mask Twitter profile

```ts
new Resource({
  schema: 'social',
  app: 'twitter',
  resourceType: 'profile',
  resourceValue: { id: 'elonmusk' },
})
```

5. Youtube video

```ts
new Resource({
  schema: 'social',
  app: 'youtube',
  resourceType: 'post',
  resourceValue: { id: '58QuLi9ff9g' },
})
```

6. RMRK2 NFT on Kusama

```ts
new Resource({
  schema: 'chain',
  chainType: 'substrate',
  chainName: 'kusama',
  resourceType: 'nft',
  resourceValue: {
    standart: 'rmrk2',
    collectionId: '22708b368d163c8007',
    tokenId: '00000020',
  },
})
```

7. Zeitgeist Market

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

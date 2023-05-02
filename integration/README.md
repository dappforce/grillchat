# Grill Widget

Grill Widget is a tiny package that you can use to integrate Grill.chat to your app. It wraps all the configs available in a simple function call.

## Installation

```bash
yarn add @subsocial/grill-widget
```

or using cdn

```html
<script src="https://unpkg.com/@subsocial/grill-widget" defer></script>
<!-- this script will expose `GRILL` variable to window.  -->
```

## Usage

1. Add div with id of `grill` to your app
2. Call `grill.init()` with configs

   ```js
   import grill from '@subsocial/grill-widget'
   grill.init(configs) // optional configs

   // or using CDN
   window.GRILL.init(configs) // optional configs
   ```

3. That's it 🥳!

## Configs

| Name              | Type                                               | Description                                                                                                                                           |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targetId`        | `string`                                           | The id of the div that you want to render the chat to. Default to `grill`                                                                             |
| `spaceId`         | `string`                                           | The id of the space that you want to show the topics from. Default to `x` (grill.chat home page)                                                      |
| `order`           | `string[]`                                         | The order of the topics (using post ids). e.g. `['1001', '1002']` if the post id exist in the space, it will be sorted based on the order provided    |
| `theme`           | `string`                                           | The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.chat>                               |
| `chatRoomId`      | `string`                                           | The id of the chat room that you want to open. If provided, it will open the chat room directly. If omitted, it will open the home page of the space. |
| `customizeIframe` | `(iframe: HTMLIFrameElement) => HTMLIFrameElement` | A function that will be called when the iframe is created. You can use this to customize the iframe attributes.                                       |

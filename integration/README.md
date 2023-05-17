## Grill Widget

Grill Widget is a tiny package (< 1kb compressed) that you can use to integrate [Grill.chat](https://grill.chat) to your app. It wraps all the config available in a simple function call.

### Installation

```bash
yarn add @subsocial/grill-widget
```

or using CDN

```html
<script src="https://unpkg.com/@subsocial/grill-widget" defer></script>
<!-- this script will expose `GRILL` variable to window.  -->
```

### Usage

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

### Customization

You can customize a Grill UI by passing a config object to `grill.init()` function. For example:

```ts
import grill from '@subsocial/grill-widget'
grill.init({
  theme: 'light',
  // other options...
})
```

All config options are optional. If you don't pass any config, it will use the default config.

| Name              | Type                                               | Description                                                                                                                       |
| ----------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `widgetElementId` | `string`                                           | The `id` of the div that you want to render the chat to. Default to `grill`                                                       |
| `hub`             | `{ id: string }`                                   | The `id` or the `domain name` of the space that you want to show the topics from. Default to `{ id: 'x' }` (grill.chat home page) |
| `channel`         | [`Channel`](#channel-option)                       | Option to make the iframe open chat room (a channel) directly. Read more about this option [here](#channel-option)                |
| `theme`           | `'light' or 'dark'`                                | The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.chat>           |
| `onWidgetCreated` | `(iframe: HTMLIFrameElement) => HTMLIFrameElement` | A function that will be called when the iframe is created. You can use this to customize the iframe attributes.                   |

#### Channel Option

Channel option is used to make the iframe open chat room (a channel) directly. This is useful if you want to have a specific topic for your user to discuss.

| Name       | Type                                   | Description                                                                          |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| `type`     | `'channel'`                            | The type of the channel. This should be set to `'channel'`                           |
| `id`       | `string`                               | The id of the channel. This should be the post id of the topic that you want to open |
| `settings` | [`ChannelSettings`](#channel-settings) | The settings of the channel. Read more about this [here](#channel-settings)          |

##### Channel Settings

You can customize the look and feel of Grill UI via channel settings.
| Name | Type | Description |
| ---- | ---- | ----------- |
| `enableBackButton` | `boolean` | If set to `true`, it will show the back button in the channel iframe. Default to `false` |
| `enableLoginButton` | `boolean` | If set to `true`, it will show the login button in the channel iframe. Default to `false` |
| `enableInputAutofocus` | `boolean` | If set to `true`, it will autofocus on the message input when the iframe is loaded. The default behavior is `true`, except on touch devices. If set `true`, it will autofocus the input on all devices. |

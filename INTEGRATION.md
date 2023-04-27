# How to Integrate Grill.chat to your app 🤝

This guide will help you to integrate Grill.chat to your app, with all the options available.

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

Grill.chat home page contains list of topics for user to choose from. This topics are listed from all the posts in a subsocial space.

For example, if you create a space with ID `1002`, then you can set the iframe `src` to `https://grill.chat/1002` to only show topics from that space.

#### 2.2. Page Options

Grill.chat has 2 pages that can be the start point.

1. Home Page
   Home page contains all of the topics in a subsocial space that you set in the `src` link. You can read more in [Space Options](#21-space-options).

```
https://grill.chat/[spaceId]
```

2. Chat Page
   You can also choose to have your user automatically opens a chat room. This is useful if you want to have a specific topic for your user to discuss.

```
https://grill.chat/[spaceId]/c/[topicId]
```

#### 2.3. Other options

You can also customize the `src` link with query parameters. Below includes the list of query parameters that you can use to customize the chat.
generate table

| Name  | Description                                                                                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| theme | Theme of the chat. Available options: `light` or `dark`. If not provided, it will use user's system preferences or his last selected theme when accessed Grill.chat |
| order | Specifies the order of the chat in home page. Pass multiple topic ids in `order` separated by comma. The other chats will be ordered based on last message          |

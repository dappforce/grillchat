<a href="https://x.grill.chat">
  <p align="center"><img height=100 src="https://raw.githubusercontent.com/dappforce/grillchat/main/src/assets/logo/logo.svg"/></p>
</a>
<p align="center">
  <strong>
    A chat application built on top of the Subsocial blockchain 🔗.
  </strong>
</p>
<p align="center">
  Grill.chat offers a smooth and simple onboarding and user experience while still leveraging the power of blockchain technology.
</p>

---

## How to integrate Grill.chat into your app 🤝

It's now simpler than ever before to have an anonymous, on-chain chat right in your application 🎉.

Read the [integration guide](./integration/README.md) to get started.

## How to run Grill.chat locally 🏃‍♂️

Requirements:

- Node.js v16.0.0 or higher
- Yarn (you can use npm/pnpm if you want to)

### 1. Install dependencies

```bash
yarn
```

### 2. Setup environment variables

Copy the local example env file to .env

```bash
cp .env.local.example .env
```

### 3. Run the server

```bash
yarn dev
```

Congrats 🎉, you can now access the app at http://localhost:3000

## Theme Customization 🎨

All of the colors used in this project are provided in the [globals.css](./src/styles/globals.css) file in RGB format.
You can change the colors in this file to customize the theme of the app according to your needs.

## Environment variables 🌎

Below is the list of environment variables that you can use to customize your chat, based upon your needs and the needs of your community.

| Name                         | Description                                                                                                                                                                                                                                                                                                           | Required? |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| SERVER_MNEMONIC              | Wallet mnemonic of the server, in order to send automatically users [Energy](https://docs.subsocial.network/docs/basics/lightpaper/architecture/energy)                                                                                                                                                               | Yes       |
| CRUST_IPFS_AUTH              | IPFS auth for using a Crust bucket                                                                                                                                                                                                                                                                                    | Yes       |
| IPFS_PIN_URL                 | URL for Crust IPFS pinning service                                                                                                                                                                                                                                                                                    | Yes       |
| CAPTCHA_SECRET               | ReCaptcha secret, read [here](https://developers.google.com/recaptcha/intro) for more information.                                                                                                                                                                                                                    | Yes       |
| USER_ID_SALT                 | Salt for user address encryption, which is used for analytics (which can be disabled)                                                                                                                                                                                                                                 | No        |
| NEXT_PUBLIC_SPACE_IDS        | Your space ID(s). All the posts in these space(s) will be listed as topics. You can use multiple space IDs, separated by a comma. The first space ID will be recognized as the main space ID, where you can access the home page in / route, but for the other space IDs homepage, you can access it using /[spaceId] | Yes       |
| NEXT_PUBLIC_MODERATION_URL   | Moderation API url. Current moderation API: `https://moderation.subsocial.network/graphql`                                                                                                                                                                                                                            | Yes       |
| NEXT_PUBLIC_CAPTCHA_SITE_KEY | ReCaptcha sitekey                                                                                                                                                                                                                                                                                                     | Yes       |
| NEXT_PUBLIC_AMP_ID           | Amplitude analytics ID (disabled if no ID is provided)                                                                                                                                                                                                                                                                | No        |
| NEXT_PUBLIC_GA_ID            | Google Analytics ID (disabled if no ID is provided)                                                                                                                                                                                                                                                                   | No        |

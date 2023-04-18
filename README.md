<a href="https://x.grill.chat">
  <p align="center"><img height=100 src="https://raw.githubusercontent.com/dappforce/grillchat/main/src/assets/logo/logo.svg"/></p>
</a>
<p align="center">
  <strong>
    Chat application built on top of Subsocial Blockchain 🔗.
  </strong>
</p>
<p align="center">
  It offers smooth and simple onboarding and UX for users while still having them leverage the power of blockchain.
</p>

---

## How to run locally 🏃‍♂️

Requirements:

- Node.js v16.0.0 or higher
- Yarn (you can use npm/pnpm if you want to)

### 1. Install dependencies

```bash
yarn
```

### 2. Setup environment variables

```bash
# Copy the local example env file to .env
cp .env.local.example .env
```

### 3. Run the server

```bash
yarn dev
```

Congrats 🎉, you can now access the app at http://localhost:3000

## Theme Customization 🎨

All the colors used in this project are provided in the [globals.css](./src/styles/globals.css) file in RGB format.
You can change the colors in this file to customize the theme of the app according to your needs.

## Environment variables 🌎

Below is the list of environment variables that you can use to customize based on your needs.

| Name                         | Description                                                                                                                                                                                                                                                                                                       | Required? |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| SERVER_MNEMONIC              | Wallet mnemonic for the server, to send token to users automatically                                                                                                                                                                                                                                              | Yes       |
| CRUST_IPFS_AUTH              | IPFS auth for using crust bucket                                                                                                                                                                                                                                                                                  | Yes       |
| IPFS_PIN_URL                 | URL for Crust IPFS pinning service                                                                                                                                                                                                                                                                                | Yes       |
| CAPTCHA_SECRET               | ReCaptcha captcha secret. Read [here](https://developers.google.com/recaptcha/intro) for more information                                                                                                                                                                                                         | Yes       |
| USER_ID_SALT                 | Salt for user address encryption, used for analytics (which can be disabled)                                                                                                                                                                                                                                      | No        |
| NEXT_PUBLIC_SPACE_IDS        | Your space id(s), where all the posts in it will be listed as topics, you can support multiple space ids, separated by comma, the first space id will be recognized as the main space id, where you can access the home page in / route, but for the other space ids homepage, you can access it using /[spaceId] | Yes       |
| NEXT_PUBLIC_CAPTCHA_SITE_KEY | ReCaptcha sitekey                                                                                                                                                                                                                                                                                                 | Yes       |
| NEXT_PUBLIC_BASE_URL         | Base URL for the site                                                                                                                                                                                                                                                                                             | Yes       |
| NEXT_PUBLIC_AMP_ID           | Amplitude analytics ID (disabled if no ID is provided)                                                                                                                                                                                                                                                            | No        |
| NEXT_PUBLIC_GA_ID            | Google Analytics ID (disabled if no ID is provided)                                                                                                                                                                                                                                                               | No        |

# HOW TO INTEGRATE GRILL CHAT IN HTML?

- Hello! We are the Coin reference team! We want to show you how we have managed to integrate the amazing Grill Chat chat into our Dotfinder.xyz application in a simple and very fast way... let's do it!

## STEPS

1. Go to the **example.html** file available in this same folder
2. **Copy** the code provided into your HTML page (Can also be implemented in a PHP page)
3. **Paste** the code on your page
4. Ready! You can now enjoy **integrated** Grill Chat very quickly and easily!

> If you want to update the chat that appears as soon as you open the chat, simply update the numbers in the parameter **id** to your chat number

## CODE

- It is **NOT** necessary to separate the code, simply copying the code and pasting would be enough.

**HTML Section**

```html
<script src="https://unpkg.com/@subsocial/grill-widget@latest" defer></script>
<div class="fixed-div">
  <div id="grill" class="chat"></div>
  <img
    id="grill-toggle"
    alt="grill-logo"
    src="https://sub.id/images/grillchat.svg"
  />
</div>
```

**JS Section**

```js
// Get the image element and the div element
const grillLogo = document.getElementById('grill-toggle')
const grillDiv = document.getElementById('grill')

// Add a click event listener to the image element
grillLogo.addEventListener('click', function () {
  // Toggle the 'grill-enabled' class on the div element
  grillDiv.classList.toggle('chat-show')

  // Check if the class 'grill-enabled' is present
  if (grillDiv.classList.contains('chat-show')) {
    // initalizing grill.
    const config = {
      widgetElementId: 'grill',
      hub: { id: 'cc' },
      channel: {
        type: 'channel',
        id: '8590', //Change this number with your chat number
        settings: {
          enableBackButton: false,
          enableLoginButton: false,
          enableInputAutofocus: true,
        },
      },
      theme: 'light',
    }
    window.GRILL.init(config)
  }
})
```

**Stlye Section**

```html
<style>
  .fixed-div {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    text-align: right;
  }

  .fixed-div img {
    width: 60px;
    height: 60px;
    margin-top: 4px;
    border-radius: 50%;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    background-color: #fff;
    padding: 1px;
  }

  .fixed-div img:hover {
    padding: 0;
  }

  .chat {
    height: min(570px, 90vh - 100px);
    width: min(400px, 100vw - 60px);
    overflow: hidden;
    border-radius: 0.625em;
    -webkit-box-shadow: 0 12px 50px -12px rgba(0, 0, 0, 0.5);
    box-shadow: 0 12px 50px -12px rgba(0, 0, 0, 0.5);
    -webkit-transition-property: opacity, height, width;
    transition-property: opacity, height, width;
    -webkit-transition-duration: 0.3s, 0s, 0s;
    transition-duration: 0.3s, 0s, 0s;
    -webkit-transition-delay: 0s, 0s, 0s;
    transition-delay: 0s, 0s, 0s;
    opacity: 1;
    display: none;
  }

  .chat iframe {
    border-radius: 0.625em;
  }

  .chat-show {
    display: block;
  }
</style>
```

### We Hope you Enjoy the tutorial and see you soon! Coin Reference Team ❤️

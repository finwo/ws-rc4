# ws-rc4  

> RC4-encrypted websocket library

[![NPM](https://nodei.co/npm/ws-rc4.png)](https://nodei.co/npm/ws-rc4/)

## Install

```bash
npm install --save ws-rc4
```

## Usage

This library encrypts all connections spawned from it with a single key. Encrypting all connections from this library
allows you to have private communications between servers (or browsers, if you want that). Those who do not know the
encryption key simply see jibberish.

### Node.JS

In the background, the [ws][ws] package is used. This package is designed to simply wrap around it, resulting in the
exact same usage.

```js
const WSRC4 = require('ws-rc4');

// Generate a new encrypted 'ws' library
let WS = WSRC4("ENCRYPTION KEY");

// Take a look at https://npmjs.com/package/ws for how to continue
```

### Browser

You could use requirejs, [browserify][browserify] or simply load [dist/browser.js](dist/browser.js) directly.

```html
<!-- Directly load the lib -->
<!-- Registers anonymously to RequireJS or onto window.WSRC4 -->
<script src="https://unpkg.com/ws-rc4/dist/browser.js"></script>
```

```js
// Browserify usages matches node's usage
// Keep in mind that ws.Server is not supported in browser
const WSRC4 = require('ws-rc4');
```


[browserify]: https://npmjs.com/package/browserify
[ws]: https://npmjs.com/package/ws
[websocket]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

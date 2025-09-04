<p align="center">
  <a title="discord-rpc-s" href="https://www.npmjs.com/package/discord-rpc-s" target="_blank">
    <img src="https://media.discordapp.net/attachments/1301409004248891443/1413274322369384561/discord-rpc-s.png?ex=68bb55c7&is=68ba0447&hm=851bfb2b20992f5ddbcda6bfdcf4a468496ecb91ea9013fd2ffa3b6ae359a8ea&=&format=webp&quality=lossless&width=1690&height=389" width="600" alt="discord-rpc-s" />
  </a>
</p>

# 🎁 Discord RPC S 🎁

![npm](https://img.shields.io/npm/v/discord-rpc-s)
![license](https://img.shields.io/npm/l/discord-rpc-s)
[![GitHub](https://img.shields.io/badge/GitHub-View-blue?logo=github)](https://github.com/shadoow051/discord-rpc-s)
[![Docs](https://img.shields.io/badge/Documentation-View-blue)](https://github.com/shadoow051/discord-rpc-s/blob/main/DOCUMENTATION.md)

A library for integrating Rich Presence in Node.js applications. It provides a modern architecture, high stability, a simple interface, and additional features that allow you to fully utilize Discord's capabilities.

## ✨ Features

- 🕐 **Easy to use** — _simple setup and integration._
- ♻️ **CommonJS & ESM support** — _use it in both require-based and import-based projects._
- ⚡ **Highly efficient** — _optimized for performance._
- 🔥 **Powerful and flexible** — _setPresence, clearPresence, connect, reconnect..._
- 🌐 **Cross-platform IPC connection** — _connects to Discord via IPC and works on Windows, macOS, and Linux._
- 📚 **And much more!**

## ⌨️ Usage Example

```
const { Client } = require("discord-rpc-s");
const client = new Client("CLIENT_ID");

client.connect();

client.on("clientReady", () => {
  console.log("Client is Ready!");

  client.setPresence({
    type: 0,
    details: "details",
    details_url: "https://discord.com",
    state: "state",
    state_url: "https://discord.com",
    timestamps: { start: Date.now() },
    party: { id: "party123", size: [1, 5] },
    buttons: [
      { label: "Button 1", url: "https://discord.com" },
      { label: "Button 2", url: "https://discord.com" },
    ],
  });
});
```

## 📦 Installation

Node.js 15 or newer is required.

```
npm install discord-rpc-s
yarn add discord-rpc-s
pnpm add discord-rpc-s
bun add discord-rpc-s
```

## 🗃️ Documentation

Full documentation is available in [DOCUMENTATION](https://github.com/shadoow051/discord-rpc-s/blob/main/DOCUMENTATION.md).

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](https://github.com/shadoow051/discord-rpc-s/blob/main/LICENSE) file for details.

## 🗒️ Changelog

See the [CHANGELOG](https://github.com/shadoow051/discord-rpc-s/blob/main/CHANGELOG.md).

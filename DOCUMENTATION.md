<p align="center">
  <a title="discord-rpc-s" href="https://www.npmjs.com/package/discord-rpc-s" target="_blank">
    <img src="https://media.discordapp.net/attachments/1301409004248891443/1413274322369384561/discord-rpc-s.png?ex=68bb55c7&is=68ba0447&hm=851bfb2b20992f5ddbcda6bfdcf4a468496ecb91ea9013fd2ffa3b6ae359a8ea&=&format=webp&quality=lossless&width=1690&height=389" width="600" alt="discord-rpc-s" />
  </a>
</p>

# 🕹️ Discord RPC S — Documentation 🕹️

![npm](https://img.shields.io/npm/v/discord-rpc-s)
![license](https://img.shields.io/npm/l/discord-rpc-s)
[![GitHub](https://img.shields.io/badge/GitHub-View-blue?logo=github)](https://github.com/shadoow051/discord-rpc-s)

## 📋 Table of Contents

- [Usage Example](#usage-example)
- [Full Presence Object](#full-presence-object)
- [All Events](#all-events)
- [Presence Type](#presence-type)

## ⌨️ Usage Example

```js
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

## 👋 Full Presence Object

All options that can be entered in the Presence object.

```js
{
    type: 0,
    details: "details",
    details_url: "https://discord.com",
    state: "state",
    state_url: "https://discord.com",
    timestamps: { start: Date.now(), end: ..., },
    party: { id: "party123", size: [1, 5] },
    assets: {
      large_image: "large_image_name",
      large_text: "text",
      large_url: "https://discord.com",
      small_image: "small_image_name",
      small_text: "text",
      small_url: "https://discord.com",
    },
    buttons: [
      { label: "Button 1", url: "https://discord.com" },
      { label: "Button 2", url: "https://discord.com" },
    ],
}
```

## 👋 All Events

List of all events:

- `clientReady` starts when the client is ready to operate.
- `connected` starts when the client connects to Discord.
- `disconnected` starts when a client disconnects from Discord.
- `reconnected` starts when the client reconnects to Discord.
- `setPresence` starts when presence is set.
- `updatePresence` starts when you update presence.
- `clearPresence` starts when you clear presence.

```js
client.on("clientReady", () => {});
```

```js
client.on("connected", () => {});
```

```js
client.on("disconnected", () => {});
```

```js
client.on("reconnected", () => {});
```

```js
client.on("setPresence", () => {});
```

```js
client.on("updatePresence", () => {});
```

```js
client.on("clearPresence", () => {});
```

## 👋 Presence Type

List of all available activity types.

```js
0 - Playing;
1 - Streaming;
2 - Listening;
3 - Watching;
5 - Competing;
```

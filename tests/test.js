const { Client } = require("./../src/cjs/index.js");

const client = new Client("");

client.connect();

client.on("clientReady", () => {
  console.log("Client id Ready!");

  client.setPresence({
    type: 3,
    details: "details",
    details_url: "https://discord.com",
    state: "state",
    state_url: "https://discord.com",
    timestamps: { start: Date.now() },
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
  });
});

/*
// 0	Playing"
// 2	Listening
// 3	Watching
// 5	Competing

client.on("clientReady", () => {})
client.on("connected", () => {})
client.on("disconnected", () => {})
client.on("reconnected", () => {})
client.on("setPresence", () => {})
client.on("updatePresence", () => {})
client.on("clearPresence", () => {})


  client.setPresence({
    type: 0,
    details: "details",
    details_url: "https://discord.com",
    state: "state",
    state_url: "https://discord.com",
    timestamps: { start: Date.now() },
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
  });

*/

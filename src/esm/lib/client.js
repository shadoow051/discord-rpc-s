import DiscordRPC from "./discord_rpc.js";

class Client {
  constructor(clientId) {
    this.rpc = new DiscordRPC(clientId);
  }

  // =========================
  // Connection
  // =========================

  connect() {
    return this.rpc.connect();
  }

  async disconnect() {
    try {
      this.rpc.destroy();
    } catch (e) {}
    return Promise.resolve();
  }

  async reconnect() {
    await this.disconnect();
    return this.connect();
  }

  // =========================
  // Presence / Activity
  // =========================

  setPresence(activity) {
    return this.rpc.setPresence(activity);
  }

  updatePresence(activity) {
    return this.rpc.setPresence(activity);
  }

  clearPresence() {
    return this.rpc.clearPresence();
  }

  // =========================
  // Events
  // =========================

  on(event, listener) {
    return this.rpc.on(event, listener);
  }

  clientReady() {
    return this.rpc.clientReady();
  }
}

export default Client;

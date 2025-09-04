import EventEmitter from "events";
import os from "os";
import { OPCODES } from "./constants.js";
import { generate_nonce } from "./helpers.js";

let IPCTransport;
const platform = os.platform();
if (platform === "win32") {
  IPCTransport = (await import("./transports/ipc_windows.js")).default;
} else if (platform === "darwin") {
  IPCTransport = (await import("./transports/ipc_mac.js")).default;
} else {
  IPCTransport = (await import("./transports/ipc_linux.js")).default;
}

class DiscordRPC extends EventEmitter {
  constructor(clientId) {
    super();
    if (!clientId) throw new Error("clientId is required");
    this.clientId = String(clientId);

    this.transport = new IPCTransport();
    this.connected = false;
    this.queue = [];
    this._connecting = false;

    this._reconnectTimer = null;
    this._reconnectDelay = 1000;
    this._maxReconnectDelay = 30000;

    this._hadConnectedBefore = false;
  }

  // -----------------------
  // Public API
  // -----------------------
  async connect() {
    if (this.connected || this._connecting) return;
    this._connecting = true;

    try {
      await this.transport.connect();

      this.transport.onData((op, payload) => {
        try {
          this.handle_message(op, payload);
        } catch (e) {
          console.error("[rpc] handle_message error:", e?.message);
        }
      });

      const sock = this.transport.socket;
      if (sock) {
        sock.on("close", () => {
          console.warn("[rpc] socket closed");
          this._on_disconnect();
        });
        sock.on("end", () => {
          console.warn("[rpc] socket ended");
          this._on_disconnect();
        });
        sock.on("error", (err) => {
          console.error("[rpc] socket error:", err?.message);
        });
      }

      const hs = { v: 1, client_id: this.clientId };

      this.send(OPCODES.HANDSHAKE, hs);

      this._clearReconnectTimer();
      this._reconnectDelay = 1000;
    } catch (err) {
      console.error("[rpc] connect error:", err?.message);
      this._scheduleReconnect();
    } finally {
      this._connecting = false;
    }
  }

  async disconnect() {
    this._clearReconnectTimer();
    try {
      if (this.transport?.destroy) this.transport.destroy();
    } catch (e) {}

    if (this.connected) {
      this.connected = false;
      this.emit("disconnected");
    }

    this.queue = [];

    return Promise.resolve();
  }

  async reconnect() {
    await this.disconnect();
    return this.connect();
  }

  setPresence(activity) {
    if (!activity) throw new Error("activity is required");

    if (!this.connected) {
      this.queue.push(() => this.setPresence(activity));
      this.emit("setPresence", activity);
      return;
    }

    const frame = {
      cmd: "SET_ACTIVITY",
      args: { pid: process.pid, activity },
      nonce: generate_nonce(),
    };

    this.send(OPCODES.FRAME, frame);

    this.emit("setPresence", activity);
    this.emit("updatePresence", activity);
  }

  updatePresence(activity) {
    return this.setPresence(activity);
  }

  clearPresence() {
    if (!this.connected) {
      this.queue = [];
      this.emit("clearPresence");
      return;
    }

    const frame = {
      cmd: "SET_ACTIVITY",
      args: { pid: process.pid, activity: null },
      nonce: generate_nonce(),
    };

    this.send(OPCODES.FRAME, frame);

    this.emit("clearPresence");
  }

  clientReady() {
    if (this.connected) return Promise.resolve();
    return new Promise((resolve) => this.once("clientReady", resolve));
  }

  destroy() {
    return this.disconnect();
  }

  // -----------------------
  // Internal helpers
  // -----------------------
  _scheduleReconnect() {
    if (this._reconnectTimer) return;
    const delay = Math.min(
      this._reconnectDelay + Math.floor(Math.random() * 1000),
      this._maxReconnectDelay
    );

    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null;
      this._reconnectDelay = Math.min(
        this._reconnectDelay * 2,
        this._maxReconnectDelay
      );
      this.connect().catch(() => {});
    }, delay);
  }

  _clearReconnectTimer() {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
  }

  _on_disconnect() {
    if (this.connected) {
      this.connected = false;
      this.emit("disconnected");
    }
    this._scheduleReconnect();
  }

  handle_message(op, payload) {
    if (!payload || typeof payload !== "object") return;

    if (payload.cmd === "DISPATCH" && payload.evt === "READY") {
      const wasReconnect = this._hadConnectedBefore && !this.connected;
      this.connected = true;
      this._hadConnectedBefore = true;

      this.emit("clientReady", payload);
      this.emit("connected", payload);
      if (wasReconnect) {
        this.emit("reconnected", payload);
      }

      const q = this.queue.slice(0);
      this.queue = [];
      q.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.error("[rpc] queued fn error:", e?.message);
        }
      });

      this._reconnectDelay = 1000;
      this._clearReconnectTimer();
      return;
    }

    if (payload.cmd === "DISPATCH" && payload.evt) {
      this.emit(String(payload.evt).toLowerCase(), payload);
    }
  }

  send(op, data) {
    if (!this.transport?.socket) {
      if (op === OPCODES.FRAME) this.queue.push(() => this.send(op, data));
      return;
    }
    this.transport.send(op, data);
  }
}

// Alias methods
DiscordRPC.prototype.set_activity = function (activity) {
  return this.setPresence(activity);
};
DiscordRPC.prototype.clear_activity = function () {
  return this.clearPresence();
};
DiscordRPC.prototype.ready = function () {
  return this.clientReady();
};
DiscordRPC.prototype.reconnect_old = function () {
  return this.reconnect();
};

export default DiscordRPC;

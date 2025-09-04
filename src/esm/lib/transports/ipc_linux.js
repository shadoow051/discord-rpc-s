import net from "net";
import EventEmitter from "events";
import path from "path";

class IPCUnix extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this._socketPath = "/tmp/discord-ipc-0";
  }

  connect() {
    return new Promise((resolve, reject) => {
      const socket = net.connect(this._socketPath, () => resolve());
      this.socket = socket;
      socket.on("data", (chunk) => this._onData(chunk));
      socket.on("close", () => this.emit("close"));
      socket.on("error", (err) => reject(err));
    });
  }

  _onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 8) {
      const op = this.buffer.readUInt32LE(0);
      const length = this.buffer.readUInt32LE(4);
      if (this.buffer.length < 8 + length) break;

      const payloadBuf = this.buffer.slice(8, 8 + length);
      const payloadStr = payloadBuf.toString("utf8");
      const first = payloadStr.trim().charAt(0);
      if (first === "{" || first === "[") {
        try {
          this.emit("data", op, JSON.parse(payloadStr));
        } catch (err) {
          console.warn("[ipc] JSON parse failed:", err.message);
        }
      } else {
        console.warn(
          "[ipc] Ignored non-JSON payload:",
          payloadStr.slice(0, 80)
        );
      }
      this.buffer = this.buffer.slice(8 + length);
    }
  }

  onData(callback) {
    this.on("data", callback);
  }

  send(op, data) {
    if (!this.socket || this.socket.destroyed) return;
    const payloadBuf = Buffer.from(JSON.stringify(data), "utf8");
    const packet = Buffer.alloc(8 + payloadBuf.length);
    packet.writeUInt32LE(op, 0);
    packet.writeUInt32LE(payloadBuf.length, 4);
    payloadBuf.copy(packet, 8);
    this.socket.write(packet);
  }

  destroy() {
    try {
      if (this.socket) {
        this.socket.end();
        this.socket.destroy();
        this.socket = null;
      }
    } catch {}
  }
}

export default IPCUnix;

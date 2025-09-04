import net from "net";
import EventEmitter from "events";

class IPCWindows extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this._connectedPipe = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const maxTries = 10;
      let lastError = null;
      let resolved = false;

      const tryPipe = (i) => {
        if (i >= maxTries) {
          if (!resolved)
            reject(lastError || new Error("No IPC pipe available"));
          return;
        }

        const pipe = `\\\\.\\pipe\\discord-ipc-${i}`;
        const socket = net.createConnection(pipe);
        let settled = false;

        socket.on("connect", () => {
          settled = true;
          this.socket = socket;
          this._connectedPipe = pipe;
          try {
            socket.setNoDelay(true);
          } catch {}
          socket.on("error", () => {});
          socket.on("close", () => {});
          if (!resolved) {
            resolved = true;
            resolve();
          }
        });

        socket.on("error", (err) => {
          lastError = err;
          if (!settled) {
            try {
              socket.destroy();
            } catch {}
            setTimeout(() => tryPipe(i + 1), 50);
          }
        });

        setTimeout(() => {
          if (!settled) {
            try {
              socket.destroy();
            } catch {}
            if (!resolved) setTimeout(() => tryPipe(i + 1), 50);
          }
        }, 900);
      };

      tryPipe(0);
    });
  }

  onData(callback) {
    if (!this.socket) throw new Error("Socket not connected");

    this.socket.on("data", (chunk) => {
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
            callback(op, JSON.parse(payloadStr));
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
    });
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

export default IPCWindows;

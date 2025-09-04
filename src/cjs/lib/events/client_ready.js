module.exports = (rpc) => {
  rpc.emit("clientReady", { clientId: rpc.clientId });
};

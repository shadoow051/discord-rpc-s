export default (rpc) => {
  rpc.emit("clientReady", { clientId: rpc.clientId });
};

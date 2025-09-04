module.exports = (rpc, activity) => {
  rpc.emit("setPresence", activity);
};

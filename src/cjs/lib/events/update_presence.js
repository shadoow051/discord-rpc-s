module.exports = (rpc, activity) => {
  rpc.emit("updatePresence", activity);
};

export default (rpc, activity) => {
  rpc.emit("updatePresence", activity);
};

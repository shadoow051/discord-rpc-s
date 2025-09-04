export default (rpc, activity) => {
  rpc.emit("setPresence", activity);
};

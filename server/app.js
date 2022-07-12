const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  allowEIO3: true, // false by default
});


io.on("connection", (socket) => {
  console.log("conectado en backend");
  io.emit("event-frontend");
});

module.exports = {
  app,
  server,
};

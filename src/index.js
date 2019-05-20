const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

const app = express();
app.use(express.static(publicDirPath));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.emit("connection");
  socket.on("msgFromClient", msg => {
    io.emit("msgToClients", msg);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

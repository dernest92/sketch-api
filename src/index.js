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
  socket.broadcast.emit("msgToClients", "A new user has joined");
  socket.on("msgFromClient", msg => {
    io.emit("msgToClients", msg);
  });

  socket.on("coordinatesFromClient", ({ lat, lng }) => {
    socket.broadcast.emit("msgToClients", `Location: lat: ${lat}, lng: ${lng}`);
  });

  socket.on("disconnect", () => {
    io.emit("msgToClients", "A user has left");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

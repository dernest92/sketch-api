const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

let strokes = [];

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

const app = express();
app.use(express.static(publicDirPath));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  console.log("new connection");
  socket.broadcast.emit("msgToClients", "A new user has joined");
  socket.emit("recieveStrokes", strokes);

  socket.on("msgFromClient", (msg, cb) => {
    socket.broadcast.emit("msgToClients", msg);
    cb();
  });

  socket.on("coordinatesFromClient", ({ lat, lng }, cb) => {
    socket.broadcast.emit(
      "msgToClients",
      `https://www.google.com/maps?q=${lat},${lng}`
    );
    cb();
  });

  socket.on("sendClearStrokes", () => {
    strokes = [];
    socket.broadcast.emit("recieveClearStrokes");
  });

  socket.on("sendStroke", stroke => {
    strokes.push(stroke);
    socket.broadcast.emit("recieveStroke", stroke);
  });

  socket.on("sendRemoveStroke", () => {
    strokes.pop();
    socket.broadcast.emit("recieveRemoveStroke");
  });

  socket.on("disconnect", () => {
    io.emit("msgToClients", "A user has left");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

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

let count = 0;

io.on("connection", socket => {
  socket.emit("connection", count);
  socket.on("updateCount", () => {
    count++;
    // socket.emit("countUpdated", count);
    io.emit("countUpdated", count);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

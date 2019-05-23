const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const boardManager = require("./boards");

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

const app = express();
app.use(express.static(publicDirPath));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("getBoardNames", cb => {
    const boardNames = boardManager.getBoardNames();
    cb(boardNames);
  });

  socket.on("newBoard", (newBoard, cb) => {
    boardManager.addBoard(newBoard);
    cb();
  });

  socket.on("joinBoard", (boardName, cb) => {
    console.log("join board", boardName);
    socket.join(boardName);
    const board = boardManager.getBoardByName(boardName);
    cb(undefined, board.strokes);
  });

  socket.on("sendClearStrokes", boardName => {
    boardManager.getBoardByName(boardName).strokes = [];
    socket.broadcast.to(boardName).emit("recieveClearStrokes");
  });

  socket.on("sendStroke", ({ stroke, boardName }) => {
    boardManager.getBoardByName(boardName).strokes.push(stroke);
    socket.broadcast.to(boardName).emit("recieveStroke", stroke);
  });

  socket.on("sendRemoveStroke", boardName => {
    boardManager.getBoardByName(boardName).strokes.pop();
    socket.broadcast.emit("recieveRemoveStroke");
  });

  socket.on("disconnect", () => {
    io.emit("msgToClients", "A user has left");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

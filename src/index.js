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
    io.emit("newBoardCreated", newBoard);
    cb();
  });

  socket.on("joinBoard", ({ boardName, user }, cb) => {
    console.log("join board", boardName);
    const board = boardManager.getBoardByName(boardName);
    if (board) {
      socket.join(boardName);
      board.users.push(user);

      cb(undefined, board.strokes);
    } else {
      cb("error loading board", undefined);
    }
  });

  socket.on("sendClearStrokes", (boardName, cb) => {
    const board = boardManager.getBoardByName(boardName);
    if (board) {
      board.strokes = [];
      socket.broadcast.to(boardName).emit("recieveClearStrokes");
      cb(undefined);
    } else {
      cb("error clearing board");
    }
  });

  socket.on("sendStroke", ({ stroke, boardName }, cb) => {
    const board = boardManager.getBoardByName(boardName);
    if (board) {
      board.strokes.push(stroke);
      socket.broadcast.to(boardName).emit("recieveStroke", stroke);
      cb(undefined);
    } else {
      cb("Error writing to board");
    }
  });

  socket.on("sendRemoveStroke", (boardName, cb) => {
    const board = boardManager.getBoardByName(boardName);
    if (board) {
      boardManager.getBoardByName(boardName).strokes.pop();
      socket.broadcast.emit("recieveRemoveStroke");
      cb(undefined);
    } else {
      cb("Error editing board");
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

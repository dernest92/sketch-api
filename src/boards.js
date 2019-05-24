module.exports = {
  boards: [],
  addBoard(boardName) {
    const newBoard = {
      name: boardName,
      strokes: [],
      users: []
    };
    this.boards.push(newBoard);
  },
  getBoardNames() {
    const names = this.boards.map(brd => brd.name);
    return names;
  },
  getBoardByName(boardName) {
    return this.boards.find(brd => brd.name === boardName);
  },
  clearBoardByName(boardName) {
    this.getBoardByName(boardName).strokes = [];
  },
  addUser({ user, boardName }) {
    const board = this.getBoardNames(boardName);
    board.users.push(user);
  }
};

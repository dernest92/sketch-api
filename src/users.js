module.exports = {
  users: [],
  createUser(user) {
    this.users.push(user);
  },
  removeUser(id) {
    const filteredUsers = this.users.filter(user => user.id !== id);
    this.users = filteredUsers;
  },
  joinBoard({ id, boardName }) {
    const user = this.findUser(id);
    if (user) {
      user.board = boardName;
    }
  },
  leaveBoard(id) {
    const user = this.findUser(id);
    if (user) {
      user.board = undefined;
    }
    console.log(this.users);
  },
  findUser(id) {
    return this.users.find(user => user.id === id);
  }
};

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
    this.users.find(user => user.id === id).board = boardName;
  },
  leaveBoard({ id, boardName }) {
    this.users.find(user => user.id === id).board = undefined;
    console.log(this.users);
  }
};

const socket = io();

const form = document.querySelector("#input-form");
const inputField = document.querySelector("#input-text");

form.addEventListener("submit", e => {
  e.preventDefault();
  const msg = inputField.value;
  socket.emit("msgFromClient", msg);
  form.reset();
});

socket.on("msgToClients", msg => {
  console.log(msg);
});

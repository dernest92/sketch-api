const socket = io();
let currentCount = undefined;

socket.on("connection", count => {
  console.log("new connection. Current count:", count);
  currentCount = count;
  countDisplay.textContent = currentCount;
});

socket.on("countUpdated", count => {
  console.log("new count. Current count:", count);
  currentCount = count;
  countDisplay.textContent = currentCount;
});

const countBtn = document.querySelector("#count-btn");
const countDisplay = document.querySelector(".current-count");

countBtn.addEventListener("click", updateCount);

function updateCount() {
  socket.emit("updateCount");
}

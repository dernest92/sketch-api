const socket = io();

const form = document.querySelector("#input-form");
const locationBtn = document.querySelector("#share-location");

form.addEventListener("submit", e => {
  e.preventDefault();
  const msg = e.target.elements.message.value;
  socket.emit("msgFromClient", msg);
  form.reset();
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported");
  }

  navigator.geolocation.getCurrentPosition(pos => {
    coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    socket.emit("coordinatesFromClient", coords);
  });
});

socket.on("coordinatesToClient", pos => {
  console.log(pos);
});

socket.on("msgToClients", msg => {
  console.log(msg);
});

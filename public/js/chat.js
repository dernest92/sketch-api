const socket = io();

const form = document.querySelector("#input-form");
const locationBtn = document.querySelector("#share-location");
const $submitBtn = document.querySelector("#submit-btn");

form.addEventListener("submit", e => {
  $submitBtn.setAttribute("disabled", "disabled");
  e.preventDefault();
  const msg = e.target.elements.message.value;
  socket.emit("msgFromClient", msg, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("message deliverd");
    }
    setTimeout(() => {
      $submitBtn.removeAttribute("disabled");
    }, 2000);
  });
  form.reset();
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported");
  }

  navigator.geolocation.getCurrentPosition(pos => {
    coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    socket.emit("coordinatesFromClient", coords, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("coordinates delivered");
      }
    });
  });
});

socket.on("coordinatesToClient", pos => {
  console.log(pos);
});

socket.on("msgToClients", msg => {
  console.log(msg);
});

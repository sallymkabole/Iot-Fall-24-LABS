// Light control functions
function updateLight(button, isOn) {
  button.textContent = isOn ? "Turn Off" : "Turn On";
  button.setAttribute("light-state", isOn);

  const card = button.closest(".card");
  const icon = card.querySelector(".light-icon");
  const text = card.querySelector(".light-text");

  if (icon) {
    icon.src = `/img/bulb-${isOn ? "on" : "off"}.svg`;
  }
  if (text) {
    text.textContent = isOn ? "Light On" : "Light Off";
  }
  
}

function toggleLight(button) {
  const roomId = button.getAttribute("room-id");
  const currentState = button.getAttribute("light-state") === "true";
  const newState = !currentState;

  fetch(`/api/room/${roomId}/light`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ light: newState }),
  })
    .then((response) => response.json())
    .then(() => updateLight(button, newState))
    .catch((error) => console.error("Error toggling light:", error));
}

function setAllLights(isOn) {
  fetch(`/api/room/lights/${isOn ? "on" : "off"}`, { method: "PATCH" })
    .then((response) => response.json())
    .then(() => {
      document
        .querySelectorAll(".toggle-light")
        .forEach((button) => updateLight(button, isOn));
    })
    .catch((error) =>
      console.error(`Error turning all lights ${isOn ? "on" : "off"}:`, error)
    );
}

// Temperature chart function
function createTemperatureChart() {
  fetch("/api/rooms/temperatures")
    .then((response) => response.json())
    .then((data) => {
      const roomData = {};
      const timestamps = new Set();

      data.forEach(({ room_id, room_name, hour, avg_temperature }) => {
        if (!roomData[room_id])
          roomData[room_id] = { name: room_name, temps: [] };
        roomData[room_id].temps.push({
          time: new Date(hour),
          temp: avg_temperature,
        });
        timestamps.add(hour);
      });

      const sortedTimes = Array.from(timestamps).sort();
      const labels = sortedTimes.map((time) =>
        new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      const datasets = Object.values(roomData).map((room, index) => ({
        label: room.name,
        data: sortedTimes.map((time) => {
          const point = room.temps.find(
            (t) => t.time.getTime() === new Date(time).getTime()
          );
          return point ? point.temp : null;
        }),
        borderColor: ["#3366cc", "#dc3912"][index % 2],
        fill: false,
      }));

      new Chart(document.getElementById("lineGraph"), {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Time" } },
            y: { title: { display: true, text: "Temperature (°C)" } },
          },
        },
      });
    })
    .catch((error) =>
      console.error("Error creating temperature chart:", error)
    );
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-light").forEach((button) => {
    button.addEventListener("click", () => toggleLight(button));
  });

  document
    .getElementById("turn-all-on")
    ?.addEventListener("click", () => setAllLights(true));
  document
    .getElementById("turn-all-off")
    ?.addEventListener("click", () => setAllLights(false));

  createTemperatureChart();
});

const express = require("express");
const pool = require("./db");
const { startLogging } = require("./plugins/sensorPlugin");

const roomRoutes = require("./routes/roomRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/rooms", roomRoutes);
startLogging();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


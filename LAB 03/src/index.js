const express = require("express");
const path = require("path");
const { startLogging } = require("./plugins/sensorPlugin");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const PORT = 5000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware
app.use(express.json());
app.use("/", roomRoutes);

startLogging();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

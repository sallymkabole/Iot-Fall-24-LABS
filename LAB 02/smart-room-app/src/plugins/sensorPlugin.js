const pool = require("../db");
// Function to log temperature every 5 seconds
const logTemperature = async (roomId) => {
  try {
    const temperature = Math.floor(Math.random() * (26 - 18 + 1)) + 18;
    //Random temperature between 18 and 26
    const timestamp = new Date();

    // Get the room name
    const roomQuery = await pool.query("SELECT name FROM rooms WHERE id = $1", [roomId]);

    if (roomQuery.rows.length === 0) {
      console.error(`Room with id '${roomId}' not found`);
      return;
    }

    const roomName = roomQuery.rows[0].name;


    await pool.query(
      "INSERT INTO temperature_logs (room_id, temperature, timestamp) VALUES ($1, $2, $3)",
      [roomId, temperature, timestamp]
    );


    console.log(`Logged temperature for '${roomName}: ID:${roomId}, Temp:${temperature}°C`);
  } catch (err) {
    console.error("Error logging temperature:", err);
  }
};

// Start logging temperature every 5 seconds
const startLogging = () => {
  setInterval(async () => {
    const res = await pool.query("SELECT id FROM rooms");
    for (const row of res.rows) {
      logTemperature(row.id);
    }
  }, 10000); // Every 10 seconds
};

module.exports = { startLogging };

// routes for creating, retrieving, updating,and deleting rooms.
const express = require("express");
const pool = require("../db");

const router = express.Router();
//GET ALL ROOMS;
router.get("/", async (req, res) => {
  try {
    const rooms = await pool.query("SELECT * FROM rooms");
    res.json(rooms.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//CREATE NEW ROOM
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newRoom = await pool.query(
      "INSERT INTO rooms (name) VALUES ($1) RETURNING *;",
      [name]
    );
    res.json(newRoom.rows[0]);
  } catch (err) {
    if (err.constraint === "rooms_name_key") {
      res.status(400).json({ error: "Room name already exists." });
    } else {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

//TURN ON ALL LIGHTS
router.patch("/lights/on", async (req, res) => {
  try {
    const rooms = await pool.query("UPDATE rooms SET light = TRUE");
    res.json("All Lights Switched On");
  } catch (err) {
    console.error(err.message);
  }
});

//TURN OFF ALL LIGHTS
router.patch("/lights/off", async (req, res) => {
  try {
    const rooms = await pool.query("UPDATE rooms SET light = FALSE");
    res.json("All Lights Switched Off");
  } catch (err) {
    console.error(err.message);
  }
});

//AVERAGE TEMPERATURE
router.get("/average-temperature", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT AVG(temperature) AS average_temperature FROM temperature_logs;"
    );

    // Check if results arent empty
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No temperature data available." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// GET ROOM BY ID
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const singleRoom = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
  
      // Check if the room exists
      if (singleRoom.rows.length === 0) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Return the room data
      res.json(singleRoom.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
//UPDATE A ROOM
router.patch("/:id/light", async (req, res) => {
  try {
    const { id } = req.params;
    const room_light_status = await pool.query(
      "SELECT light FROM rooms WHERE id = $1",
      [id]
    );

    if (room_light_status.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    const currentLight = room_light_status.rows[0].light;
    const new_status = !currentLight;

    const toggleLightStatus = await pool.query(
      "UPDATE rooms SET light = $1 WHERE id = $2 RETURNING *;",
      [new_status, id]
    );

    if (toggleLightStatus.rowCount === 0) {
        return res.status(404).json({ error: "Room doesnt exist." });
      }
      
      res.json({ message: `Light toggled. New status - '${new_status}'` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//DELETE A ROOM
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRoom = await pool.query("DELETE FROM rooms WHERE id = $1", [
      id,
    ]);
    if (deleteRoom.rowCount === 0) {
      return res.status(404).json({ error: "Room doesnt exist." });
    }
    res.json("Room deleted Successfully");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

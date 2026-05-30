const express = require("express");
const { runSimulation } = require("../controllers/simulationController");

const router = express.Router();

router.post("/", runSimulation);

module.exports = router;

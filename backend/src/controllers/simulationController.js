const { runSimulationService } = require("../services/simulationService");

const runSimulation = async (req, res) => {
  const { code } = req.body || {};

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      message: "A non-empty `code` string is required.",
    });
  }

  try {
    const result = await runSimulationService(code);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unable to simulate code.",
    });
  }
};

module.exports = {
  runSimulation,
};

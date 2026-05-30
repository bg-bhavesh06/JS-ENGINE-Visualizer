const { simulateCode } = require("../engine/simulator");

const runSimulationService = async (code) => {
  return await simulateCode(code);
};

module.exports = {
  runSimulationService,
};

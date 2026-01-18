const express = require("express");
const { clearAndSeed } = require("../utilities/dbSetup");

const devRouter = express.Router();

devRouter.get("/reset-db", async (req, res, next) => {
  try {
    const result = await clearAndSeed();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = devRouter;

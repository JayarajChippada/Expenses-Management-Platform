const express = require("express");

const { verifyToken } = require("../utilities/verifyUser");

const dashboardController = require("../controllers/Dashboard.controller");

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/",
  verifyToken,
  dashboardController.fetchDashboardDetails
);

module.exports = dashboardRouter;

const express = require("express");
const reportsController = require("../controllers/Reports.controller");
const { verifyToken } = require("../utilities/verifyUser");

const reportsRouter = express.Router();

reportsRouter.get("/overview", verifyToken, reportsController.getOverview);
reportsRouter.get("/trends", verifyToken, reportsController.getTrends);
reportsRouter.get("/categories", verifyToken, reportsController.getCategoryBreakdown);
reportsRouter.get("/merchants", verifyToken, reportsController.getMerchantBreakdown);
reportsRouter.get("/export", verifyToken, reportsController.exportReport);


module.exports = reportsRouter;

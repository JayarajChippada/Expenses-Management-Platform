const reportsService = require("../services/Reports.service");

let reportsController = {};

reportsController.getOverview = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { dateRange } = req.query;
        const data = await reportsService.getOverview(userId, dateRange);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log("Reports Controller getOverview() method Error: ", error);
        next(error);
    }
};

reportsController.getTrends = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { dateRange } = req.query;
        const data = await reportsService.getTrends(userId, dateRange);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log("Reports Controller getTrends() method Error: ", error);
        next(error);
    }
};

reportsController.getCategoryBreakdown = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { dateRange } = req.query;
        const data = await reportsService.getCategoryBreakdown(userId, dateRange);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log("Reports Controller getCategoryBreakdown() method Error: ", error);
        next(error);
    }
};

reportsController.getMerchantBreakdown = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { dateRange } = req.query;
        const data = await reportsService.getMerchantBreakdown(userId, dateRange);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log("Reports Controller getMerchantBreakdown() method Error: ", error);
        next(error);
    }
};

reportsController.exportReport = async (req, res, next) => {
    try {
        const { format } = req.query;
        res.status(200).json({ success: true, message: `Report export in ${format} format is not yet fully implemented, but the endpoint is ready.` });
    } catch (error) {
        console.log("Reports Controller exportReport() method Error: ", error);
        next(error);
    }
};

module.exports = reportsController;

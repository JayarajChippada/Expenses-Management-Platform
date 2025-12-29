const dashboardService = require("../services/Dashboard.service");

let dashboardController = {};

dashboardController.fetchDashboardDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { range, category } = req.query;

    const dashboardData = await dashboardService.fetchDashboardDetails(
      userId,
      range,
      category
    );
    res.status(200).json({
      success: true,

      data: dashboardData,
    });
  } catch (error) {
    console.log(
      "Dashboard Controller fetchDashboardDetails() method Error: ",
      error
    );

    next(error);
  }
};

module.exports = dashboardController;

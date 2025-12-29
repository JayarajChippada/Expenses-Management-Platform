const express = require("express");

const categoryController = require("../controllers/Category.controller");

const { verifyToken } = require("../utilities/verifyUser");

const categoryRouter = express.Router();

categoryRouter.post("/", verifyToken, categoryController.addCategory);

categoryRouter.get(
  "/names/:type",
  verifyToken,
  categoryController.fetchCategoryNamesByUserId
);

categoryRouter.get(
  "/:type",
  verifyToken,
  categoryController.fetchCategoriesByUserId
);

categoryRouter.get(
  "/:categoryName/:type",
  verifyToken,
  categoryController.fetchCategory
);

categoryRouter.patch(
  "/:categoryName",
  verifyToken,
  categoryController.updateCategory
);

module.exports = categoryRouter;

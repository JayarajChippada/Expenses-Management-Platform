const express = require("express");

const categoryController = require("../controllers/Category.controller");

const { verifyToken } = require("../utilities/verifyUser");

const categoryRouter = express.Router();

categoryRouter.post("/", verifyToken, categoryController.addCategory);

categoryRouter.get(
  "/",
  verifyToken,
  categoryController.fetchCategoriesByUserId
);

categoryRouter.get(
  "/names/:type",
  verifyToken,
  categoryController.fetchCategoryNamesByUserId
);

categoryRouter.get(
  "/:type",
  verifyToken,
  categoryController.fetchCategoriesByType
);

categoryRouter.get(
  "/:categoryName/:type",
  verifyToken,
  categoryController.fetchCategory
);

categoryRouter.patch(
  "/:categoryId",
  verifyToken,
  categoryController.updateCategory
);

categoryRouter.delete(
  "/:categoryId",
  verifyToken,
  categoryController.deleteCategory
);

module.exports = categoryRouter;

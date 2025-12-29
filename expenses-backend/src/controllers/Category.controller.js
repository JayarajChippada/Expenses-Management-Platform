const Category = require("../models/classes/Category");

const categoryService = require("../services/Category.service");

const Validator = require("../utilities/validator");

let categoryController = {};

categoryController.addCategory = async (req, res, next) => {
  const { categoryName } = req.body;

  try {
    const userId = req.user.userId;

    if (!categoryName || categoryName === "") {
      let error = new Error("Category is required");

      error.status = 400;

      throw error;
    }

    const categoryObj = new Category({ userId: userId, ...req.body });

    const resObj = await categoryService.addCategory(categoryObj);

    if (resObj !== null) {
      res
        .status(201)
        .json({ success: true, message: "Category added successfully!", data: resObj });
    } else {
      let error = new Error("Category Insertion");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Category Controller addCategory() method Error: ", error);

    next(error);
  }
}; 

categoryController.fetchCategoryNamesByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const type = req.params.type
    const categoryNames = await categoryService.fetchCategoryNamesByUserId(
      userId, type
    );

    res.status(200).json({
      success: true,
      data: categoryNames,
    });
  } catch (error) {
    console.log(
      "Category Controller fetchCategoryNamesByUserId() method Error: ",
      error
    );

    next(error);
  }
};

categoryController.fetchCategoriesByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const type = req.params.type
    const categories = await categoryService.fetchCategoriesByUserId(userId, type);

    if (categories !== null) {
      res.status(200).json({
        success: true,
        data: categories,
      });
    } else {
      let error = new Error("No categories found!");

      error.status = 404;

      throw error;
    }
  } catch (error) {
    console.log(
      "Category Controller fetchCategoriesByUserId() method Error: ",
      error
    );

    next(error);
  }
};

categoryController.fetchCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const type = req.params.type
    const categoryName = req.params.categoryName;

    if (!categoryName || categoryName === "") {
      let error = new Error("Category is required");

      error.status = 400;

      throw error;
    }

    // await Validator.validateCategory(userId, categoryName)

    const category = await categoryService.fetchCategory(userId, categoryName, type);

    if (category !== null) {
      res.status(200).json({
        success: true,
        data: category,
      });
    } else {
      let error = new Error("Category not found!");

      error.status = 404;

      throw error;
    }
  } catch (error) {
    console.log("Category Controller fetchCategory() method Error: ", error);

    next(error);
  }
};

categoryController.updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const categoryName = req.params.categoryName;

    if (!categoryName || categoryName === "") {
      let error = new Error("Category is required");

      error.status = 400;

      throw error;
    }

    const categoryObj = new Category({ userId: userId, ...req.body });

    const resObj = await categoryService.updateCategory(
      categoryName,
      categoryObj
    );

    if (resObj !== null) {
      res
        .status(200)
        .json({ success: true, message: "Category updated successfully!", data: resObj });
    } else {
      let error = new Error("Category Updation failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Category Controller updateCategory() method Error: ", error);

    next(error);
  }
};

module.exports = categoryController;

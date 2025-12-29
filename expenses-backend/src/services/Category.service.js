const categoryModel = require("../models/Category.model");

let categoryService = {};

categoryService.addCategory = async (categoryObj) => {
  try {
    const category = await categoryService.fetchCategory(
      categoryObj.userId,
      categoryObj.categoryName,
      categoryObj.type
    );

    if (category !== null) {
      let error = new Error("Category already exists for this particular user");

      error.status = 400;

      throw error;
    }

    const resObj = await categoryModel.create(categoryObj);

    if (resObj) {
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Category Service addCategory() method Error: ", error);

    throw error;
  }
};

categoryService.fetchCategoryNamesByUserId = async (userId, type) => { 
  try {
    const categories = await categoryModel.find(
      { userId: userId, type: type },
      { _id: 0, categoryName: 1 }
    );

    if (categories.length > 0) {
      let categoryList = [];

      categories.forEach((category) => {
        categoryList.push(category.categoryName);
      });

      return categoryList;
    } else {
      return [];
    }
  } catch (error) {
    console.log(
      "Category Service fetchCategoriesByUserId() method Error: ",
      error
    );

    throw error;
  }
};

categoryService.fetchCategoriesByUserId = async (userId, type) => {
  try {
    const categories = await categoryModel.find({ userId: userId, type: type });

    if (categories.length > 0) {
      return categories;
    } else {
      return null;
    }
  } catch (error) {
    console.log(
      "Category Service fetchCategoriesByUserId() method Error: ",
      error
    );

    throw error;
  }
};

categoryService.fetchCategory = async (userId, categoryName, type) => {
  try {
    const category = await categoryModel.findOne({
      userId: userId,
      categoryName: categoryName,
      type: type,
    });

    if (category) {
      return category;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Category Service fetchCategory() method Error: ", error);
    throw error;
  }
};

categoryService.updateCategory = async (categoryName, categoryObj) => {
  try {
    // 1. Check if the category already exists for avoiding duplicate categories

    const category = await categoryService.fetchCategory(
      categoryObj.userId,
      categoryName,
      categoryObj.type
    );

    if (!category) {
      let error = new Error("Category doesn't exists for this particular user");

      error.status = 400;

      throw error;
    }

    if (categoryObj.categoryName)
      category.categoryName = categoryObj.categoryName;

    if (categoryObj.color) category.color = categoryObj.color;

    if (categoryObj.icon) category.icon = categoryObj.icon;

    if (categoryObj.type) category.type = categoryObj.type;

    if (categoryObj.keywords) category.keywords = categoryObj.keywords;

    // 2. Else, Insert the category into the category collection

    const resObj = await category.save();

    if (resObj) {
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Category Service updateCategory() method Error: ", error);

    throw error;
  }
};

module.exports = categoryService;

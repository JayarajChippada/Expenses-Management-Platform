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

categoryService.fetchCategoriesByUserId = async (userId) => {
  try {
    const categories = await categoryModel.find({ userId: userId });

    if (categories.length > 0) {
      return categories;
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
      "Category Service fetchCategoryNamesByUserId() method Error: ",
      error
    );

    throw error;
  }
};

categoryService.fetchCategoriesByType = async (userId, type) => {
  try {
    const categories = await categoryModel.find({ userId: userId, type: type });

    if (categories.length > 0) {
      return categories;
    } else {
      return null;
    }
  } catch (error) {
    console.log(
      "Category Service fetchCategoriesByType() method Error: ",

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

categoryService.deleteCategory = async (categoryId) => {
  try {
    const response = await categoryModel.deleteOne({ _id: categoryId });

    if (response.deletedCount > 0) {
      return { message: "Category deleted Successfully" };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Category Service deleteCategory() method Error: ", error);

    throw error;
  }
};

categoryService.updateCategory = async (categoryId, categoryObj) => {
  try {
    const category = await categoryModel.findOne({ _id: categoryId });

    if (categoryObj.categoryName)
      category.categoryName = categoryObj.categoryName;

    if (categoryObj.color) category.color = categoryObj.color;

    if (categoryObj.icon) category.icon = categoryObj.icon;

    if (categoryObj.type) category.type = categoryObj.type;

    if (categoryObj.keywords) category.keywords = categoryObj.keywords;

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

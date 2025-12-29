const categoryModel = require("../models/Category.model");

let Validator = {};

Validator.validateEmail = (email) => {
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegExp.test(email)) {
    let error = new Error("Please provide a valid email address");

    error.status = 400;

    throw error;
  }
};

Validator.validatePassword = (password) => {
  const passwordRegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  if (!passwordRegExp.test(password)) {
    let error = new Error(
      "Password must be 8-20 characters long and include uppercase, lowercase, number, and special character"
    );

    error.status = 400;

    throw error;
  }
};

Validator.validateName = (name) => {
  const nameRegExp = /^[A-Za-z][A-za-z]{1,49}$/;

  if (!nameRegExp.test(name)) {
    let error = new Error(
      "Name must contain only letters and be 2 to 50 characters long"
    );

    error.status = 400;

    throw error;
  }
};

Validator.validateCategory = async (userId, categoryName, type) => {
  const category = await categoryModel.findOne({
    userId: userId,
    categoryName: categoryName,
    type: type,
  });

  if (!category) {
    let error = new Error("Enter a valid category");

    error.status = 400;

    throw error;
  }
};

module.exports = Validator;

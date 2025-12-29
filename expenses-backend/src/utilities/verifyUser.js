const jwt = require("jsonwebtoken");

const Config = require("../config/Configs");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    if (!token) {
      let error = new Error("Unauthorized");

      error.status = 401;

      throw error;
    }

    jwt.verify(token, Config.JWT_TOKEN, (err, user) => {
      if (err) {
        let error = new Error("Unauthorized");

        error.status = 401;

        throw error;
      }

      req.user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken };

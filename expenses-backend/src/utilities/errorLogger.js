const fs = require("fs");

const errorLogger = (err, req, res, next) => {
  const errMsg = err.stack + "\n";

  fs.appendFile("ErrorLogger.txt", errMsg, (error) => {
    if (error) {
      console.log("Appending error message failed");
    }
  });

  const statusCode = err.status || 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,

    statusCode,

    message,
  });
};

module.exports = errorLogger;

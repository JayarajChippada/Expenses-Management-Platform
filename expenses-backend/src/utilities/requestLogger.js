const fs = require("fs");

const requestLogger = function (req, res, next) {
  let logMessage = "" + new Date() + " " + req.method + " " + req.url + "\n";

  fs.appendFile("RequestLogger.txt", logMessage, function (err) {
    if (err) return next(err);
  });

  next();
};

module.exports = requestLogger;

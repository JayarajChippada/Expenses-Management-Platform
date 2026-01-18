const dotenv = require("dotenv");

dotenv.config();

let Config = {};

Config.PORT = process.env.PORT || 3000;

Config.MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://jayarajchippada9_db_user:wUIheefzIrSvdWEM@cluster0.ydpuoha.mongodb.net/?appName=Cluster0";

Config.JWT_TOKEN = process.env.JWT_TOKEN || "secretTokenSoDontask";

Config.HOST = process.env.HOST || "";

Config.EMAIL_USER = process.env.EMAIL_USER || "";

Config.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";

Config.NODE_ENV = process.env.NODE_ENV || "development";

Config.CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

module.exports = Config;

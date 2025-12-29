const express = require("express");

const connectDB = require("./config/Database");

const Config = require("./config/Configs");

const App = require("./config/ExpressApp");

const StartServer = async () => {
  const app = express();

  await connectDB();

  await App(app);

  app.listen(Config.PORT, () => {
    console.log(`Listening to port ${Config.PORT}`);
  });
};

StartServer();

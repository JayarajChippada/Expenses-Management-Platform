const nodemailer = require("nodemailer");

const Config = require("../config/Configs");

const sendMail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: Config.HOST,

    port: Config.PORT,

    auth: {
      user: Config.EMAIL_USER,

      password: Config.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "jayarajchippada9@gmail.com",

    to: option.email,

    subject: option.subject,

    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendMail;

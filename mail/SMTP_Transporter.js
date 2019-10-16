require("dotenv").config();

const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USR,
    pass: process.env.GMAIL_PSW
  }
});

const sendMail = async (email, username, starting_weight, goal_weight) => {
  await transporter.sendMail(
    {
      from: process.env.GMAIL_USR,
      to: email,
      subject:
        "Thank for registering with Brian's Calorie Tracker. Let's be healthy!",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Brian Calorie Counter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
          <body>
            <div>
              <h1> 
              Brian's Calorie Tracker
              </h1>
              <p> 
                Hello ${username}, thank you for registering to use Brian's Calorie Counter. You can now login to your account at <a href="http://localhost:3000/auth/${username}">Login to Account</a>.
              </p>
              <p>
                <strong>Thank you</strong> so much for using our software!
              </p>
              <p>
                Now, let's get you from your starting weight of ${starting_weight} down to your goal weight of ${goal_weight}
              </p>
            </div>
          </body>
        </html>
        `
    },
    (err, info) => {
      if (err || info) {
        console.log(err, info);
      } else {
        console.log();
      }
    }
  );
};

module.exports = sendMail;

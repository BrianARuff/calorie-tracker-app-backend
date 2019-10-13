require("dotenv").config();

const express = require("express");
const app = express();

const middleWare = require("./middleware/serverMiddleware");
middleWare(app);

app.listen(process.env.PORT || 3001, () =>
  console.log(
    `\nApplication Backend running on port ${process.env.PORT ||
      3001}. Time at logging is ${new Date().toLocaleString()}.\n`
  )
);

// error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  switch (res.statusCode) {
    case 500:
      res
        .json({
          message: err.message,
          status: res.statusCode,
          info: "Server Error has Occurred"
        })
        .end();
    case 404:
      res
        .json({
          message: err.message,
          status: res.statusCode,
          info: "Resource or Resources were not Found"
        })
        .end();
    default:
      res.json({
        message: err.message,
        status: 500,
        info: "Default Error Message"
      });
  }
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
      <title>Document</title>
    </head>
    <body>
      <div>
        <h1>Application Backend Running</h1>
        <ul>
          <li>
            <a href="/users">
              Users
            </a>
          </li>
          <ul>
            <li>
              <a href="users/before_images">
                Before Images
              </a>
            </li>
            <li>
              <a href="users/after_images">
                After Images
              </a>
            </li>
          </ul>
          <li>
            <a href="/journal">
              Journals
            </a>
          </li>
          <li>
            <a href="/meals">
              Meals
            </a>
          </li>
        </ul>
        <hr>
      </div>
    </body>
    </html>
  `);
});

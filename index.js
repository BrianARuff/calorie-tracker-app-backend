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

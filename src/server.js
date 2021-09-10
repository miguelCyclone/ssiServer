// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This is the init script
//

// Imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require('dotenv').config();
const config = require("./configurations/config").config();
const routes = require("./routes/routes");

const GREEN = "\x1b[32m%s\x1b[0m";

// Express initailization
const app = express();

app.use(
  cors({
    exposedHeaders: ["Authorization, Content-disposition"],
  })
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

routes(app);

app.use((err, req, res, next) => {
  console.log(err);
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status).send({ error: "Ops.. Something failed!", msg: err });
});

// Starting the app
const port = process.env.PORT || config.PORT;
app.listen(port, () => {
  console.log(GREEN, `[OK] DID API listening on port ${port}`);
});
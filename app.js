const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const whitelist = [process.env.CLIENT_URL, 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
      console.log('ffffffffffffffffffffff')
    } else {
      console.log('eeeeeeeeeeeeeeeeeeeee', "Not allowed by CORS")
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions));

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

module.exports = app;
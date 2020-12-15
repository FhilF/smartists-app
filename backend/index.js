const express = require("express");
const { setup } = require("radiks-server");
const cors = require("cors");
const testRouter = require("./routes/testRoutes");

require("dotenv").config();
const makeApiController = require('./apiController');

var app = express();
app.use(cors());
app.use(express.json());
// app.use(function(req, res, next) {
//   res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use(express.json());
const port = process.env.PORT || 5002;

setup().then((RadiksController) => {
  app.use("/radiks", RadiksController);
  app.use('/api', makeApiController(RadiksController.DB));
});

app.use("/test-connection", testRouter);

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

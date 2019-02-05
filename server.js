const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport  = require("passport");

// const session = require("express-session");
// const fileStore = require("session-file-store")(session)


const API_PORT = 3001;
const app = express();

// this is our MongoDB database
const dbRoute = "mongodb://localhost/Events";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
).then(console.log("MongoDB has started")).catch(e => console.log(e));
mongoose.set('useCreateIndex', true);


const db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error",  () => console.error("MongoDB connection error:"));
const routes = require('./routes');

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", routes);



// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
const mongoose = require("mongoose");
const express = require("express");
// const session = require("express-session");
// const fileStore = require("session-file-store")(session)


const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://localhost/Events";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
).then(console.log("MongoDB has started")).catch(e => console.log(e));
mongoose.set('useCreateIndex', true);


let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));
require('./routes/Events');
// require('./routes/Users');

app.use("/api", router);




// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
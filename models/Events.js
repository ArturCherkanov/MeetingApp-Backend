const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const EventSchema = new Schema(
  {
    name: String,
    users: Array,
    timeFrom: Date,
    timeTo: Date,
    room: String,
    message: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("events", EventSchema);

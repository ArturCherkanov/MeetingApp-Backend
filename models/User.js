const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const UserSchema = new Schema(
    {

        firstname: {
            type: String,
            unique: false,
            required: true
        },
        imgData:{
            type:Object,
            required: true,
        },
        lastname:{
            type: String,
            unique: false,
            required: true
          },
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema);

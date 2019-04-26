const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const User = require('../models/User');
const user = new User();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});




router.post('/', (req, res) => {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        cloudinary.v2.uploader.upload(files.file.path, (err, imageData) => {
            console.log(imageData)
            return res.send(imageData)
        });
    });
});

module.exports = router

const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require("mongoose")

const postRoutes = require('./routes/posts')

const app = express();

mongoose.connect("mongodb+srv://patrick:MUr8c4kQuK2frTp5@cluster0-jrerw.mongodb.net/node-angular?retryWrites=true")
    .then(() => {
        console.log('Connection Made')
    }).catch(() => {
        console.log('Connection Failed')
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//any thing that target the below is allowed 
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    )
    next();
})
    
app.use("/api/posts",postRoutes);

module.exports = app;
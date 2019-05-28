const express = require('express');
const bodyParser = require("body-parser");

const Post = require('./models/post')
const mongoose = require("mongoose")


const app = express();

mongoose.connect("mongodb+srv://patrick:MUr8c4kQuK2frTp5@cluster0-jrerw.mongodb.net/node-angular?retryWrites=true")

.then(()=>{
    console.log('Connection Made')
}).catch(()=>{
    console.log('Connection Failed')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    )
    next();
})

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save().then(data=>{
        console.log(data)
        res.status(201).json({
            message: 'Post added successfully',
            postId:data._id
        });
    });
    
});

app.get('/api/posts', (req, res, next) => {

    Post.find().then(documents =>{
        res.status(200).json({
            message: "Posts fetched successfully",
            posts: documents
        })
        // res.json(documents);
    });

    // res.json(posts);
});

app.delete("/api/posts/:id",(req,res,next)=>{
    // console.log(req.params.id)/
//More Info
//https://mongoosejs.com/docs/api.html

    Post.deleteOne({_id:req.params.id}).then((result)=>{
        res.status(200).json({message:'Post deleted'})
    }).catch(error=>{
        console.log('error')
        console.log(error)
    })
})

module.exports = app;
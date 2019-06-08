const express = require("express");

const User = require("../models/user");

//for creating encoded passwords
const bcrypt = require("bcrypt");

//for creating a token if authenticated users
const jwt = require("jsonwebtoken");

const router = express.Router();

//for password enryption
//npm i --save bcrypt

router.post("/signup", (req, res, next) => {
    console.log("1");
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: "User Created",
                    result: result,
                });
            }).catch(err => {
            res.status(500).json({
                message: "Invalid authentication credentials!",
            });
        });
    });

})
;

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Auth Failed",
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            res.status(401).json({
                message: "Invalid authentication details",
            });
        }
        const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id,
            },
            "secret_this_should_be_longer",
            {
                expiresIn: "1h",
            },
        );

        res.status(200).json({
            expiresIn: "3600",
            message: "Logged in",
            token: token,
            userId: fetchedUser._id,
        });
        // We get the userId in the token however it would impact performance
        // if we would have to decode the token on the client side

    }).catch(err => {
        console.log(err);
        res.status(401).json({
            message: "You are not authenticated",
        });
    });
});

module.exports = router;

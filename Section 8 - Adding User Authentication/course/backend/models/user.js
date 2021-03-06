const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//npm i --save mongoose-unique-validator
//package to ensure unique items are unique

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

});

//ensures the email is unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

const { default: mongoose } = require("mongoose");
let mongo = require("mongoose");

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    number_of_post: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model("users", userScheme)
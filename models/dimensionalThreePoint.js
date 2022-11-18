/* eslint-disable unicorn/no-null */
// generate user models file mongoose
const mongoose = require("mongoose");

const dimensionalThreePointShema = new mongoose.Schema({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    z: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }    
});


module.exports = mongoose.model("point3d", dimensionalThreePointShema);
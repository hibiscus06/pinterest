const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    image:{
        type:String
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    }

});

module.exports = mongoose.model('Post', postSchema);
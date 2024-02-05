const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterestdb");

const userSchema = new mongoose.Schema({
  username: { type: String, 
    unique: true, 
    required: true }, 

  password: { type: String
     },

  posts: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' }], 

  profileImage: { type: String }, 

  email: { type: String, 
    unique: true, 
    required: true },

  fullname: { type: String, 
    required: true },

  contact: Number,
  
  boards:{
    type:Array,
    default:[]
  }

     
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);




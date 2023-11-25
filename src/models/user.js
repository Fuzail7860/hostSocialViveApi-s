const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileImage: {
        type:String,
        default:'https://w7.pngwing.com/pngs/981/645/png-transparent-default-profile-united-states-computer-icons-desktop-free-high-quality-person-icon-miscellaneous-silhouette-symbol-thumbnail.png'
    },
    userName: {
        type:String,
        required:true
    },
    fullName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    bio: {
        type:String,
        default:null
    },
    links: {
        type:Array,
        default:[]
    },
    isDeleted: {
        type:Boolean,
        default:false
    },
    fcmToken: {
        type:String,
        default:null
    },
    validOTP:{type:Boolean,default:false},
    deviceType: {
        type:String,
        default:null
    },
    token: {
        type:String,
        default:null
    },
  });

  module.exports = mongoose.model('Users', userSchema)
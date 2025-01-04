const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required'],
       
    },
    lastName: {
        type: String,
        required: [true, 'last name is required'],
        
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },

    userType: {
        type: String,
        // required:[true, 'userType is required'],
        enum: ['user', 'admin'],
        default: 'user'
    },
    isBlock: {
        type: Boolean,
        default: false
    },


    profile: {
        type: String,
        default: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
    },
    answer: {
        type: String,
        // required: [true, 'answer is required']
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
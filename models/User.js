const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 3,
        maxLength: 40,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: 'Invalid Email Address!'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password']
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    following: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'User'
    },
    followers: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'User'
    }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const randomBytes = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, randomBytes);
});

userSchema.methods.comparePassword = async function(guess) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

module.exports = mongoose.model('User', userSchema);
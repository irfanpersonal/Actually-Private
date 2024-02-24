import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    profilePicture: string,
    dateOfBirth: Date,
    location: string,
    bio: string,
    followers: mongoose.Schema.Types.ObjectId[],
    following: mongoose.Schema.Types.ObjectId[],
    visibility: 'public' | 'private',
    createdAt: Date,
    updatedAt: Date,
    followRequestCooldowns: Map<string, Date>,
    blockedUsers: mongoose.Schema.Types.ObjectId[],
    role: 'user' | 'admin',
    comparePassword: (guess: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 3,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        validate: {
            validator: (value: string) => {
                return validator.isEmail(value);
            },
            message: 'Invalid Email Address'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    visibility: {
        type: String,
        required: [true, 'Must Provide User Visibility'],
        enum: {
            values: ['public', 'private'],
            message: '{VALUE} is not supported'
        },
        default: 'public'
    },
    followRequestCooldowns: {
        type: Map,
        of: Date,
        default: new Map()
    },
    blockedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    role: {
        type: String,
        required: [true, 'Must Provide User Role'],
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not supported'
        }
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

userSchema.pre('save', async function(this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const randomBytes = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, randomBytes);
});

userSchema.methods.comparePassword = async function(this: IUser, guess: string) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

export default mongoose.model<IUser>('User', userSchema);
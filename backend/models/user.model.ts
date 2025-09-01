import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 254
    },
    password: {
        type: String,
        required: true,
        minlength: 12
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    pfp: {
        type: String,
        default: ""
    },
    jwt: {
        type: String,
        default: ""
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;
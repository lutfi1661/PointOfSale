import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    userId: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean}

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
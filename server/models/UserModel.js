import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserModel = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String, default: "/images/anon.jpg" },//https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg
}, { timestamps: true })

UserModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserModel.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    // console.log(this.password)
})

const User = mongoose.model("User", UserModel)

export default User;
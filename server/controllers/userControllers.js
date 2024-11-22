
import asyncHandler from 'express-async-handler';
import User from "../models/UserModel.js"
import generateToken from '../config/generateToken.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    // console.log("Request Body: ", name, email, password, pic)

    if (!name || !email || !password) {
        res.status(400).json({ message: "Please enter all the fields!" })
    }
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400).json({ message: "User already exists!" })
    }
    const user = await User.create({
        name,
        email,
        password,
        pic,
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
    else {
        res.status(400).json({ message: "Failed to create the user" })
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(401).json({ message: "Invalid email or password!" })
    }
})

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {

    };
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.status(200).send(users)
})


export { registerUser, authUser, allUsers };
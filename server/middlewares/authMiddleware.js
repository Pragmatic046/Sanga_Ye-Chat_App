import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
             // Extract token from header
            token = req.headers.authorization.split(" ")[1];
            // console.log("Token received:", token);

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decoded);
             // Find user by ID from token and exclude password from response
            req.user = await User.findById(decoded.id).select("-password")
            // console.log("User found:", req.user);
            // Move to the next middleware if token is valid
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).send("Not authorized, token failed")
        }
    }
    if (!token) {
         // If no token is provided in the authorization header
        res.status(401).send("Not authorized, no token")
    }
})

export default protect;
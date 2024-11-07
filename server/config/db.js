import mongoose from "mongoose";
import colors from 'colors';


const connectDB = async () => {
    try {
        // console.log(`MongoDB Connecting: ${process.env.MONGO_URI}`.green);
        mongoose.set('debug', true);  // Add this line before connecting
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`.red);
        process.exit();
    }
}

export default connectDB;
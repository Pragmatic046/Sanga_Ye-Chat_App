import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import cors from "cors"
import chatRoutes from "./routes/chatRoutes.js"
import router from './routes/chatRoutes.js';

dotenv.config();
connectDB()
const app = express();
app.use(cors()) //{origin: "http://localhost:5173"}
app.use(express.json()) // to accept JSON


app.get('/', async (req, res) => {
    res.json("API Is Running Successfully!")
})

// This should not include http://localhost:5000
app.use('/user', userRoutes)
app.use("/chat", chatRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5001; //port number 

app.listen(PORT, () => {
    console.log(`Click It: --> http://localhost:${PORT}`.yellow.bold.underline)
})


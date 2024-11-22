import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import cors from "cors"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from './routes/messageRoutes.js';
import path from "path"
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB()
const app = express();
app.use(cors(
    { allowedHeaders: ['Content-Type', 'Authorization'], } // Allow necessary headers (optional)
)) //{origin: "http://localhost:5173"}

app.use(express.json()) // to accept JSON
app.use(express.static(path.join(process.cwd(), 'server', 'public')));


app.get('/', async (req, res) => {
    res.json("API Is Running Successfully!")
})

// This should not include http://localhost:5000
app.use('/user', userRoutes)
app.use("/chat", chatRoutes)
app.use("/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5001; //port number 

app.listen(PORT, () => {
    console.log(`Click It: --> http://localhost:${PORT}`.yellow.bold.underline)
})


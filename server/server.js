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
import { Server } from 'socket.io';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB()
const app = express();
app.use(cors(
    { allowedHeaders: ['Content-Type', 'Authorization'], } // Allow necessary headers (optional)
)) //{origin: "http://localhost:3000"}

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

const server = app.listen(PORT, () => {
    console.log(`Click It: --> http://localhost:${PORT}`.yellow.bold.underline)
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit('connected')
    })
    // --------------------------------------------------------------------------
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })
    // --------------------------------------------------------------------------
    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })
    // --------------------------------------------------------------------------
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined")
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })
})
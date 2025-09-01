import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import messageRoutes from './routes/message.routes'
import connectToDB from "./db/connectToDB";
import { initSocket } from "./socket";
import { consoleLog } from "./utils/customConsole";

dotenv.config()
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
}));
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

const server = http.createServer(app);
initSocket(server);

app.listen(5000, () => {
    connectToDB();
    consoleLog('SERVER', 'INFO', 'Server is running...')
})
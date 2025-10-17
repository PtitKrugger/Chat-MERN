import http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Server, Socket } from "socket.io";
import crypto from "crypto";

import { consoleLog } from "./utils/customConsole";
import User from "./models/user.model";

type User = {
    userId: string,
    socketId: string,
    status: Status
}

type Status = "Online" | "Away" | "Busy"
const validStatuses: Status[] = ["Online", "Away", "Busy"]

let usersSockets: Array<User> = [];
var io: Server;

export function initSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.listen(3000);
    consoleLog("SOCKET", "INFO", "Socket is running...");


    // JWT verification on connection
    io.use(async (socket, next) => {
        try {
            await verifyJWT(socket)

            next();
        } catch (err) {
            return socket.disconnect(true)
        }
    });


    io.on("connection", (socket) => {
        const userId = socket['userId'];

        if (isUserConnected(userId)) {
            deleteUser(userId)
        }
        usersSockets.push({ userId, socketId: socket.id, status: 'Online' })
        emitOnlineUsers()

        socket.on("changeStatus", async (data) => {
            await verifyJWT(socket)

            const newStatus = data["status"]

            if (validStatuses.includes(newStatus as Status)) {
                const user = findUser(userId)

                if (user) {
                    user["status"] = newStatus

                    // Replace the whole User
                    deleteUser(userId)
                    usersSockets.push(user)

                    emitOnlineUsers()
                }
            }
        })

        socket.on("isTyping", async (data) => {
            await verifyJWT(socket)

            const senderId = userId
            const receiverId = data["typingTo"]
            const isTyping = data["isTyping"]

            if (typeof isTyping === "boolean" && typeof receiverId === "string") {
                if (isUserConnected(receiverId)) {
                    io.to(findUserSocketId(receiverId)).emit("userTyping", {
                        senderId,
                        isTyping
                    })
                }
            }
        })

        socket.on("disconnect", () => {
            deleteUser(userId)
            emitOnlineUsers()
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

export function getUsersSockets() {
    return usersSockets;
}

export function isUserConnected(userId: string) {
    return usersSockets.some(u => u.userId === userId)
}

export function findUserSocketId(userId: string) {
    return usersSockets[usersSockets.findIndex(u => u.userId === userId)]['socketId'];
}

async function verifyJWT(socket: Socket) {
    try {
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        const token = cookies.jwt;

        if (!token) {
            //socket.emit("Unauthorized", "Unauthorized Access - No Token");
            return socket.disconnect(true)
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        if (decodedToken) {
            const user = await User.findById(decodedToken["userId"])
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
            const isJwtCorrect = hashedToken === user?.jwt;

            if (!isJwtCorrect) {
                //socket.emit("Unauthorized", "Unauthorized Access - Invalid Token");
                return socket.disconnect(true)
            }

            socket["userId"] = decodedToken["userId"];
        }            
    }
    catch (e) {
        consoleLog("SOCKET", "ERROR", e)
    }
}

function emitOnlineUsers() {
    io.emit("getOnlineUsers", usersSockets.map(u => ({
        userId: u.userId,
        status: u.status
    })))
}

function findUser(userId: string) {
    return usersSockets.find(u => u.userId === userId);
}

function deleteUser(userId: string) {
    usersSockets = usersSockets.filter(u => u.userId !== userId);
}
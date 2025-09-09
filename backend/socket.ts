import http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Server } from "socket.io";
import { consoleLog } from "./utils/customConsole";

const usersSockets = {};
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

    io.use((socket, next) => {
        try {
            const cookies = cookie.parse(socket.request.headers.cookie || "");
            const token = cookies.jwt;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;

            next();
        } catch (err) {
            return next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.userId;
        usersSockets[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(usersSockets));
        //console.log(usersSockets);

        socket.on("disconnect", () => {
            delete usersSockets[userId];
            io.emit("getOnlineUsers", Object.keys(usersSockets));
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
    return Object.keys(usersSockets).includes(userId);
}

export function findUserSocketId(userId: string) {
    return usersSockets[userId];
}

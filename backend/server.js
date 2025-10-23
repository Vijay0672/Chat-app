import express from "express"

import "dotenv/config"
import http from "http"
import cors from "cors"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app)

// in
export const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins
  },
});
//store online users 
 export const userSocketMap ={}///{userId:socketId}

 //socket.io
 io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("userCoonected",userId);
    if(userId) userSocketMap[userId]= socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("ud",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

 })


// middle ware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());


//routes setup
app.use("/api/status",(req,res)=>res.send("server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);



//connect MongoDB 
await connectDB();

if(process.env.NODE_ENV!=="production"){
  const PORT = process.env.PORT|| 4000;
server.listen(PORT,()=> console.log("server is running on this port : "+PORT));
}

export default server;
/*
import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins
  },
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.IO events
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("userConnected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("userDisconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect MongoDB and start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
*/
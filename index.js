import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongo.js";
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/users.js'
import adminRouter from "./routes/admin.js";
import { Server } from "socket.io";

const app = express();



app.use(cors({ origin: true, credentials: true }))


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use(express.static("public"));

const port = 5000;

connectDB()




app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});


const server = app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});
let activeUsers = [];
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
    console.log("Sent online users:", activeUsers);
  });
  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

});
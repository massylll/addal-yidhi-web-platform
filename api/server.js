// Importing required modules: express, cors, multer, and cookie-parser
import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import env from 'dotenv';

// importing the routes needed for each functionality of the application
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import postRoutes from "./routes/postsRoutes.js";
import commentRoutes from "./routes/commentsRoutes.js";
import likeRoutes from "./routes/likesRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import storiesRoutes from "./routes/storiesRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js"; // import message routes
import requestsRoutes from "./routes/requestsRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import feedbacksRoutes from "./routes/feedbacksRoutes.js";
import notificationRoutes from "./routes/notificationsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import statsRoutes from "./routes/userPstatsRoutes.js";

// Importing the database connection
import db from "./connect.js";

// Initializing environment variables
env.config();

// Creating an instance of the Express application
const app = express();

// Setting up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());

// Setting up routes for each functionality of the application
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/conversations", messageRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/profilestats", statsRoutes);

// Setting up file upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// Creating an HTTP server
const server = createServer(app);

// Creating Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
export default io;

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle socket events here
});

// Starting the server
const port = process.env.PORT || 8800;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

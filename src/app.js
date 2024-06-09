import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Routes
import userRouter from "../src/routers/user.route.js";
import noteRouter from "../src/routers/note.route.js"
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes",noteRouter );

// Export app
export default app;

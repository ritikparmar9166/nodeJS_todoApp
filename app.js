import express from "express";
import userRouter from "./routes/user.js"
import taskRouter from "./routes/task.js"
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config({
    path:"./data/config.env"
})

//middleware for json data, use it before routes
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//using routes
app.use("/api/v1/users",userRouter)
app.use("/api/v1/tasks",taskRouter)


app.get("/", (req, res)=>{
    res.send("nice working")
})

//using error middleware
app.use(errorMiddleware);


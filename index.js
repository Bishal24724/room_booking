import express from 'express';
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";


import connectDB from "./config/db.js";


import userRoutes from "./routes/admin/userRoutes.js";
import customerRoutes from "./routes/customer/customerRoutes.js";

//dot env config

dotenv.config();

//database connection
connectDB();

const app= express();

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());

app.use("/api/admin",userRoutes);
app.use("/api/customer",customerRoutes);
app.get('/',(req,res)=>{
    return res.status(200).send("<h1>Welcome to node </h1>" );
});



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT} on ${process.env.NODE_ENV} Mode` );
});

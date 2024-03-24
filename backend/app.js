import express from "express";
import dotenv from "dotenv";
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js'
import { connectDatabase } from "./config/dbconnect.js";
import errorMiddleware from './middlewares/errors.js'
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js"
const app=express()
dotenv.config({path:"backend/config/config.env"})
//gerer les exceptions non attrapée
process.on('uncaughtException',(err)=>{
    console.log(`Uncaught Exception: ${err}`);
    console.log("shutting down due to uncaught exception");
    process.exit(1)
})

//connection a la base de donnée
connectDatabase();
//limit 10mb pour le coudinary
app.use(express.json(
        {   limit: "10mb",
            verify:(req,res,buf)=>{
                req.rawBody=buf.toString()
            } 
        }));
app.use(cookieParser());
//import des routes

app.use("/api/v1",productRoutes);
app.use("/api/v1",authRoutes);
app.use("/api/v1",orderRoutes);
app.use("/api/v1",paymentRoutes);


//error middleware
app.use(errorMiddleware);
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
});

//gerer  les rejection non gerer
process.on('unhandledRejection',(err)=>{
    console.log(`ERROR :${err}`);
    console.log("shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import productRoutes from "./routes/product_routes.js";
import userRoutes from "./routes/user_routes.js";
import orderRoutes from "./routes/order_routes.js";

dotenv.config();
const app=express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

const PORT = process.env.PORT || 5000;//To import port variable from .env file. or 5000 in case if we forget to put it in env file.


app.use('/api/users', userRoutes);


app.use("/api/products",productRoutes);


app.use('/api/orders',orderRoutes);

// console.log(process.env.MONGO_URI);
app.listen(PORT,()=>{
    connectDB();
    console.log("Server started at http://localhost:"+PORT);
});


// xhIyHErQDTcWsMQi password for mongodb
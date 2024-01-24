import mongoose from "mongoose";
import product from "../models/product.js";
import products from './data.js'
const seedProducts =async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/shopit");

        await product.deleteMany();
        console.log("prodcts are delected");

        await product.insertMany(products);
        console.log("products are added");
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

seedProducts();
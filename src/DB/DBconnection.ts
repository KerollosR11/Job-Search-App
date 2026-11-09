import mongoose from "mongoose";
import { env } from "../Config/config.service";


const connectDB = async () :Promise<void> =>{
    const DB_URI = env.DB_URI;
    try {
        await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`Database connected Successfully!`);
        
    } catch (error) {
        console.log(`Faild to connect with Database`, error);
        throw error; 
    }
};

export default connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


export async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 30000, // Increase server selection timeout
            socketTimeoutMS: 45000,
        })
        console.log('DB connected successfully')

    } catch (error) {
        console.log('Failed to connect DB ' + error)
    }
}

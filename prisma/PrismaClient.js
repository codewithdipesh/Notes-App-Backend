import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export const connectDB = async () =>{
    try {
        prisma.$connect()
        console.log("Connected to the database successfully")
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
}
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()


export const connectdb = async()=>{
    try {
        await prisma.$connect()
        console.log("connected to Database")
    } catch (e) {
        console.log(e)
        await prisma.$disconnect()
    }
}

import { connectdb } from "../prisma/PrismaClient.js"
import app from "./app.js"
import dotenv from "dotenv"

dotenv.config({path:"./.env"})

connectdb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Database connection failed !!! ", err);
})
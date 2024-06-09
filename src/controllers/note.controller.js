import { prisma } from "../../prisma/PrismaClient.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


//create note
export const createNote = async(req,res,next)=>{
   try {
     const {title,content} =req.body
     if(!title){
         throw new ApiError(400,"Title is required")
     }
     if(!content){
         throw new ApiError(400,"Content is required")
     }
     const note = await prisma.note.create({
       data:{
         title:title,
         content:content,
         authorId: req.user.id
       }
     })
     if(!note){
         throw new ApiError(500,"Unable to create new Note")
     }
     return res.status(200).json(
         new ApiResponse(200,"Note created successfully",note)
     )
   } catch (error) {
      throw new ApiError(500,"Something went wrong creating the note "+ error.message)
   }
}
//update note
//delete note
//get all notes
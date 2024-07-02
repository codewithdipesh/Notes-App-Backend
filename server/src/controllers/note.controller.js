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
      throw new ApiError(500,"Something went wrong creating the note "|  error.message)
   }
}
//update note
export const updateNote = async(req,res,next)=>{
try {
    const noteId = parseInt(req.params.noteId)
    if(!noteId){
      throw new ApiError(400,"NoteId is required")
    }
    const {title,content} = req.body
    let updatedNote
    if(!title && !content){
      throw new ApiError(400,'Nothing to be updated')
      }
    else if(!title){
      updatedNote = await prisma.note.update({
        where:{id:noteId},
        data:{content :content}
      })
    }
    else if(!content){
      updatedNote = await prisma.note.update({
        where:{id:noteId},
        data:{title :title}
      })
    }
    else{
      updatedNote = await prisma.note.update({
        where:{id:noteId},
        data:{
          title :title,
          content :content
        }
      })
    }
  
    if(!updateNote){
      throw new ApiError(500,"Unable to update note")
    }
  
    return res.status(200).json(
      new ApiResponse(200,"Note updated successfully",{updatednote : updatedNote})
    )
      
} catch (e) {
  throw new ApiError(500,"Something went wrong in server\n"| e?.message)
}
  
}
//delete note
export const deleteNote = async(req,res,next)=>{
  try {
    const noteId = parseInt(req.params.noteId)
    if(!noteId){
      throw new ApiError(400,"NoteId is required")
    }
    const deletedNote = await prisma.note.delete({
      where:{id:noteId}
    })
    if(!deletedNote){
      throw new ApiError(500,"Unable to delete note")
    }
  
    return res.status(200).json(
      new ApiResponse(200,"Note deleted successfully",{})
    )
      
  } catch (e) {
    throw new ApiError(500,"Something went wrong in server\n"| e?.message)
  }

}

//get all notes
export const getAllnotes = async(req,res,next)=>{
  try {
    const notes = await prisma.note.findMany({
      where:{authorId:req.user.id},
      select:{
        id:true,
        title:true,
        content:true,
        createdAt:true,
        updatedAt:true
      }
    })
    if(!notes || notes.length === 0){
      throw new ApiError(400,"There is no Notes present")
    }
     
    return res.status(200).json(
      new ApiResponse(200,"All Notes fetched successfully",{notes :notes})
    )
  } catch (e) {
    throw new ApiError(500,'Something went wrong\n'| e?.message)
  }
  
}
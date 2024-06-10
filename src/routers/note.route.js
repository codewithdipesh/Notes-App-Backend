import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createNote, getAllnotes, updateNote } from "../controllers/note.controller.js";

const router = Router()

router.route("/").get(verifyJwt,getAllnotes)
router.route("/create-new").post(verifyJwt,createNote)
router.route("/:noteId").patch(verifyJwt,updateNote)


export default router
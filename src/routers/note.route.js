import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createNote } from "../controllers/note.controller.js";

const router = Router()

router.route("/create-new").post(verifyJwt,createNote)

export default router
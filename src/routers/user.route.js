import { Router } from "express";
import { SignUp, login } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(SignUp);
router.route("/login").post(login);

export default router;

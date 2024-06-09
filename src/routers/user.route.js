import { Router } from "express";
import { SignUp, changePassword, login, logout } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(SignUp);
router.route("/login").post(login);
router.route("/change-password").post(verifyJwt,changePassword);
router.route("/logout").post(verifyJwt,logout);


export default router;

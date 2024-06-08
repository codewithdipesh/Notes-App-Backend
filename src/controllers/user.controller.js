import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/PrismaClient.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";

const getHashedPassword = async (stringPassword) => {
    return await bcrypt.hash(stringPassword, 10);
};

const RefreshToken = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
    );
};

const AccessToken = (id, email) => {
    return jwt.sign(
        { id, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2d" }
    );
};

const IsPasswordCorrect = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await prisma.owner.findUnique({
            where: { id: userId }
        });
        const accesstoken = AccessToken(user.id, user.email);
        const refreshtoken = RefreshToken(user.id, user.email);

        await prisma.owner.update({
            where: { id: userId },
            data: { refreshToken: refreshtoken },
        });

        return { accesstoken, refreshtoken };
    } catch (e) {
        console.log(e);
        throw new ApiError(500, "Error while generating token");
    }
};

export const SignUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new ApiError(400, "Email is required");
        }
        if (!password) {
            throw new ApiError(400, "Password is required");
        }
        const existingUser = await prisma.findUnique({
            where:{email:email}
        })
        if(existingUser){
            throw new ApiError(400,"User already existed")
        }
        const hashedPassword = await getHashedPassword(password);
        const user = await prisma.owner.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });
        if (!user) {
            throw new ApiError(500, "Unable to sign up");
        }

        const createdUser = await prisma.owner.findUnique({
            where: { id: user.id },
            select: { id: true, email: true }
        });
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong");
        }
        return res.status(200).json(
            new ApiResponse(200, "Successfully created user", createdUser)
        );
    } catch (error) {
        console.log(error);
        next(new ApiError(500, "Something went wrong"));
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new ApiError(400, "Email is required");
        }
        if (!password) {
            throw new ApiError(400, "Password is required");
        }
        const user = await prisma.owner.findUnique({
            where: { email: email }
        });
        if (!user) {
            throw new ApiError(400, "Invalid Credentials");
        }
        const correctPassword = await IsPasswordCorrect(password, user.password);
        if (!correctPassword) {
            throw new ApiError(400, "Password is Incorrect");
        }
        const { accesstoken, refreshtoken } = await generateAccessandRefreshToken(user.id);

        const loggedInUser = await prisma.owner.findUnique({
            where: { id: user.id },
            select: { id: true, email: true }
        });
        const options = {
            httpOnly: true,
            secure: true
        };
        return res
            .status(200)
            .cookie("accesstoken", accesstoken, options)
            .cookie("refreshtoken", refreshtoken, options)
            .json(new ApiResponse(200, "Login Successful", { user: loggedInUser, accesstoken, refreshtoken }));
    } catch (error) {
        console.log(error);
        next(new ApiError(500, "Something went wrong" + error));
    }
};

import { ApiResponse } from "../utils/ApiResponse.js"

export const healthcheck = async(req,res,next)=>{
    return res.status(200).json(
        new ApiResponse(200,"Server is running healthy")
    )
}
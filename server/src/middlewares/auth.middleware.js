import jwt from "jsonwebtoken"
import { prisma } from "../../prisma/PrismaClient.js"
import { ApiError } from "../utils/ApiError.js"

const generateAccessTokenByRefreshToken = async(refreshtoken)=>{
    try {
        const decodedRefreshToken = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await prisma.owner.findUnique({
            where:{id :decodedRefreshToken.id},
            select:{id:true,email:true,refreshtoken:true}
        })
        if(!user || user.refreshToken !== refreshtoken){
            throw new ApiError(400,"Invalid Refresh Token ")
        }
        //generate access token
        const newaccesstoken = jwt.sign({
           id:user.id,
           email:user.email 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "2d"}
        )
    
        return newaccesstoken
    } catch (error) {
        throw new ApiError(400,"Invalid Refresh Token "+error.message)
        
    }

}
export const verifyJwt = async(req,res,next)=>{
 
  try {
    const accesstoken = req.cookies?.accesstoken || req.header("authorization")?.replace("Bearer ","")
    if(!accesstoken){
      throw new ApiError(400,"Unauthorized Error")
    }

    let decodedtoken
    try {
       decodedtoken =  jwt.verify(accesstoken,process.env.ACCESS_TOKEN_SECRET)
    } catch (e) {
      if(e.name == "TokenExpiredError"){
          const refreshtoken = req.cookies?.refreshtoken
          if(!refreshtoken){
              throw new ApiError("Unauthorized Access")
          }
          try {
              const newaccesstoken = await generateAccessTokenByRefreshToken(refreshtoken)
              res.cookie("accesstoken",newaccesstoken,{httpOnly:true,secure:true})
              decodedtoken = jwt.verify(newaccesstoken,process.env.ACCESS_TOKEN_SECRET)
          } catch (error) {
              throw new ApiError(401,"Invalid Refresh Token")
          }        
      }else{
          throw new ApiError(400,"Invalid Access Token")
      }
      
    }
    const user = await prisma.owner.findUnique({
      where:{id:decodedtoken.id},
      select:{
          id:true,
          email:true
      }
    })
    if(!user){
      throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }

}
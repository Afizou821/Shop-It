//verifier si l'utilisateur est authentifie

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken"
import User from "../models/user.js";

export const  isAuthenticatedUser= catchAsyncErrors(async (req,res,next)=>{
   const {token}= req.cookies;

   if(!token){
    return next( new ErrorHandler("Login fir to access to this ressource",401));
   }
   const decode=jwt.verify(token,process.env.JWT_SECRET);
  
   req.user= await User.findById(decode._id)
   next();
})

//authorize user role
export const authorizeRoles=(...roles)=>{
   return (req,res,next)=>{
      
      if (!roles.includes(req.user.role)) {
         return next(new ErrorHandler(`You Role : ${req.user.role} perform this action`,403));
      }
      next();
   };
}
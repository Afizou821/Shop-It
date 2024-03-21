import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'
import { delete_file, upload_file } from "../utils/cloudinary.js";
//register user => /api/v1/register
export const registerUser =catchAsyncErrors(async(req,res,next)=>{
    
   const {name, email,password} =req.body;
       
   const user= await User.create({
    name,
    email ,
    password,
   }); 
   sendToken(user,201,res)
}); 

//register user => /api/v1/login
export const loginUser =catchAsyncErrors(async(req,res,next)=>{
    
    const { email,password} =req.body;
        
    if(!email || !password){
        return next(new ErrorHandler('please enter email and password',400));
    }
    const user = await User.findOne({email}).select("+password");
    //checking if the user exists or not
    if (!user) {
        return next( new ErrorHandler('Invalid email or password','401'));
    }
    //checking if the password is correct or not
    const isMatch =await user.comparePassword(password);
    
    if(!isMatch){
        return next (new ErrorHandler('Invalid email or password','401'))
    }
    sendToken(user,200,res)
 }); 



 //log out =>
 export const logoutUser =catchAsyncErrors(async(req,res,next)=>{
    
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly :true
    });

    res.status(200).json({
        message:"log out"
    })
 })
 //upload user avatar => /api/v1/me/upload_avatar
 export const uploadAvatar =catchAsyncErrors(async(req,res,next)=>{
    
    const avatarResponse= await upload_file(req.body.avatar,"shopit/avatars");

    //remove previos avatar
    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id);
    }

    const user =await  User.findByIdAndUpdate(req?.user?._id ,{avatar:avatarResponse});

    res.status(200).json({
        user,
    })
 })

//password forgot => /api/v1/password/forgot
 export const forgotPassword =catchAsyncErrors(async(req,res,next)=>{
    

    const user = await User.findOne({email:req.body.email});
    //checking if the user exists or not
    if (!user) {
        return next( new ErrorHandler('User not found with this email','404'));
    }
    //get reset password token
    const resetToken=user.getResetpasswordToken();
    
    await  user.save();

    //create reset password url
    const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message= getResetPasswordTemplate(user?.name,resetUrl);

    try{
        await sendEmail({email:user.email,subject:'ShopIt Password Recovery',message});
        res.status(200).json({
            message:`Email sent to :${user.email}`,
        });
    }catch(error){
      
        
        return next(new ErrorHandler(error?.message,'500'))
    }
    
 }); 

 //password forgot => /api/v1/password/forgot
 export const ResetPassword =catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has expired','400'));
     
    }
    //pour verifier password et confilr password
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Passwords do not match','400') )
    }
    //set the new password
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire= undefined;
    await user.save();

    sendToken(user,200,res);

 });

 //get current user profile => /api/v1/me
 export const getUserProfile =catchAsyncErrors(async (req,res,next) => {
    
        const user =await User.findById(req?.user?._id);
        
        res.status(200).json({
            user,
            })
 });

  //Update password current user profile => /api/v1/me
  export const updatePassword=catchAsyncErrors(async (req,res,next) => {
    
    
    const user =await User.findById(req?.user?._id).select("+password");
  

    //check the the previous user password
    const isPasswordMatched =await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Your old password is incorrect', '400'));
    }
    user.password = req.body.passwordassword;
    user.save();
    console.log(user)
    res.status(200).json({
        success:true,
     })
});

 //Update  user profile => /api/v1/me
 export const updateProfile=catchAsyncErrors(async (req,res,next) => {
    
    const newUserData={
        name : req.body.name ,
        email : req.body.email 

    }  

    const user= await User.findByIdAndUpdate(req.user._id,newUserData,{new:true})
    res.status(200).json({
        user,
     })
});

//get all user
export const getallUser=catchAsyncErrors(async (req,res,next) => {
    
   
    const user= await User.find();
    res.status(200).json({
        user,
     })
});
//get user details => /api/v1/users/:id
export const getUserById=catchAsyncErrors(async (req,res,next) => {
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`No user found with id ${req.params.id}`));
    }
    res.status(200).json({
        user,
    })
});

//Update  user profile => /api/v1/admin/users/:id
export const updateUser=catchAsyncErrors(async (req,res,next) => {
    
    const newUserData={
        name : req.body.name ,
        email : req.body.email ,
        role : req.body.role,

    }  
        console.log(req.params.id)
    const user= await User.findByIdAndUpdate(req.params.id,newUserData,{new:true});
    console.log(user);
    res.status(200).json({
        user,
     })
});

//delete users  api/v1/admin/users/:id
export const deleteUser=catchAsyncErrors(async (req,res,next) => {
    const user= await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`No user found with id ${req.params.id}`));
    }
    //Todo -Remove user avatar from cloudinary
    await user.deleteOne()
    res.status(200).json({
       success:true,
      
    });
});
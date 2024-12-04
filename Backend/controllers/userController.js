import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errors.js";
import {User} from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import {sendToken} from "../utils/jwtToken.js"

export const register = catchAsyncErrors(async(req, res, next) => {
    try{
        const {
            name, 
            email, 
            phone, 
            address, 
            password, 
            role, 
            firstNiche, 
            secondNiche, 
            thirdNiche, 
            coverLetter
        } = req.body;
        if(!name || !email || !phone || !address || !password || !role){
            return next(new ErrorHandler("All fields are required!", 400));
        }
        if(role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
            return next(new ErrorHandler("Please provide your preferred niches.", 400));
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ErrorHandler("Email is already in use", 400));
        }

        const userData = {
            name, 
            email, 
            phone, 
            address, 
            password, 
            role, 
            niches: {
                firstNiche, 
                secondNiche, 
                thirdNiche, 
            },
            coverLetter
        };
        if(req.files && req.files.resume){
            const {resume} = req.files;
            if(resume){
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
                        folder: "Job-seekers-resume"
                    });
                    if(!cloudinaryResponse || cloudinaryResponse.error){
                        return next(new ErrorHandler("Failed to upload resume to cloud", 500));
                    } 
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url
                    }
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume", 500));
                }
            }
        }
        const user = await User.create(userData);
        sendToken(user, 201, res, "User Registered.");
    }catch(error){
        return next(error);
    }
});

export const login =  catchAsyncErrors(async(req, res, next) => {
    const {role, email, password} = req.body;
    if(!role || !email || !password){
        return next(new ErrorHandler("Email/Password/Role are required", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("Invalid role.", 400));
    }
    sendToken(user, 200, res, "User Logged in successfully.");
})
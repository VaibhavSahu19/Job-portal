import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errors.js";
import {User} from "../models/userSchema.js";

export const regiser = catchAsyncErrors(async(req, res, next) => {
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

    }catch(error){

    }
});
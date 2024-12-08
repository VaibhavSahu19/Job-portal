import mongoose from "mongoose";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errors.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("User is not Authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} not allowed to access resources.`))
        }
        next();
    }
}

export const getAllJobs = catchAsyncErrors(async(req, res, next) => {
    const {city, niche, searchKeyword} = req.query;
    const query = {};
    if(city){
        query.location = city;
    }
    if(niche){
        query.jobNiche = niche;
    }
    if(searchKeyword){
        query.$or = [
            {
                title: {$regex: searchKeyword, $options: "i"}
            },
            {
                companyName: {$regex: searchKeyword, $options: "i"}
            },
            {
                introduction: {$regex: searchKeyword, $options: "i"}
            }
            //"i" makes the query search case insensitive
        ]
    }

    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        count: jobs.length,
    })
})
export const getMyJobs = catchAsyncErrors(async(req, res, next) => {
    const myJobs = await Job.find({postedBy: req.user._id});
    res.status(200).json({
        success: true,
        myJobs
    })
})
export const deleteJob = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Job ID", 400));
    }
    const job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("No such job found", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully."
    })

})
export const getASingleJob = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Job ID", 400));
    }
    const job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Job  Not found", 404));
    }
    res.status(200).json({
        success: true,
        job
    })
})
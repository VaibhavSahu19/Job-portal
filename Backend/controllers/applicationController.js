import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errors.js";
import { Application } from "../models/applicationSchema.js";

export const postApplication = catchAsyncErrors(async(req, res, next) => {

});
export const employerGetAllApplication = catchAsyncErrors(async(req, res, next) => {
    
});
export const jobSeekerGetAllApplication = catchAsyncErrors(async(req, res, next) => {
    
});
export const deleteApplication = catchAsyncErrors(async(req, res, next) => {
    
});
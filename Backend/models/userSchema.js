import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userScehema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [1, "Name cannot be empty"],
        maxLength: [30, "Name is too long"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid Email"]
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    niches: {
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must contain atleast 8 characters."],
        maxLength: [20, "Password cannot exceed 20 characters."]
    },
    resume: {
        public_id: String,
        url: String
    },
    coverLetter: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model("User", userScehema);
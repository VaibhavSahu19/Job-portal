import express from "express";
import { postJob } from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized, getAllJobs, getMyJobs, deleteJob, getASingleJob } from "../middlewares/auth.js";

const router = express.Router();
router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getAllJobs", getAllJobs);
router.get("/getMyJobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", isAuthenticated, getASingleJob);

export default router;
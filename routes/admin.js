import { Router } from "express";
import { SignIn } from "../controllers/adminController.js";

const router = Router();

router.post("/admin/signin", SignIn)
//router.post("/movies", )

export default router;
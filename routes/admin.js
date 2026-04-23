import { Router } from "express";
import { SignIn, createMovie, getAllMovies, updateMovie, deleteMovie } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const router = Router();

// Login (no token needed)
router.post("/signin", SignIn);

// Movie management (token required)
router.post("/movies", verifyAdminToken, createMovie);

router.get("/movies", verifyAdminToken, getAllMovies);
router.put("/movies/:id", verifyAdminToken, updateMovie);
router.delete("/movies/:id", verifyAdminToken, deleteMovie);

export default router;
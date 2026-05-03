import express from 'express';
import {
    initializePayment,
    verifyPayment,
    getSubscriptionStatus,
} from '../controllers/subscription.Controller.js';
import { verifyUserToken } from '../middleware/userAuth.js';
const router = express.Router();

// All subscription routes require login

router.post("/initialize", verifyUserToken, initializePayment);   // POST /api/v1/subscription/initialize

// pi/v1/subscription/verify?reference=xxx

router.get("/verify", verifyUserToken, verifyPayment);            // GET  /api/v1/subscription/verify?reference=xxx

router.get("/status", verifyUserToken, getSubscriptionStatus);    // GET /api/v1/subscription/status


export default router;

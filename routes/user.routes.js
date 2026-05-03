import express from 'express';
import {
	postSignup,
	verifyEmail,
	postSignin,
	resendVerificationEmail,
	getVerificationStatus,
	forgotPassword,
	resetPassword,
	getUserProfile,
	getCurrentUserProfile,
	updateUserSettings
} from '../controllers/user.controller.js';
import { verifyUserToken } from '../middleware/userAuth.js';

const router = express.Router();

router.post('/signup', postSignup);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.get('/verification-status', getVerificationStatus);
router.post('/signin', postSignin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyUserToken, getCurrentUserProfile);
router.patch('/profile', verifyUserToken, updateUserSettings);
router.get('/settings', verifyUserToken, getCurrentUserProfile);
router.patch('/settings', verifyUserToken, updateUserSettings);
router.get("/user/profile", getUserProfile);


export default router;
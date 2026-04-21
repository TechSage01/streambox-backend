import express from 'express';
import {
	postSignup,
	verifyEmail,
	postSignin,
	resendVerificationEmail,
	getVerificationStatus,
	forgotPassword,
	resetPassword,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', postSignup);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.get('/verification-status', getVerificationStatus);
router.post('/signin', postSignin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
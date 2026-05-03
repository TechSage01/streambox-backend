import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const buildVerificationLink = (token) => {
    const backendBase = process.env.BACKEND_URL || `https://movieverse-backend-fjf3.onrender.com`;
    return `${backendBase}/user/verify-email?token=${token}`;
};

const buildResetPasswordLink = (token) => {
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${frontendBase}/forgot-password?token=${token}`;
};

const sendVerificationEmail = async ({ fullName, email, token }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationLink = buildVerificationLink(token);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h3>Hello ${fullName},</h3>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}" target="_blank">Verify Email</a>
            <p>If you did not request this, please ignore this email.</p>
        `
    });
};

const sendResetPasswordEmail = async ({ fullName, email, token }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetLink = buildResetPasswordLink(token);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `
            <h3>Hello ${fullName},</h3>
            <p>Click the link below to reset your password. This link expires in 15 minutes:</p>
            <a href="${resetLink}" target="_blank">Reset Password</a>
            <p>If you did not request this, you can safely ignore this email.</p>
        `
    });
};

            // Create a new user
const postSignup = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }
        if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
        }
         const existingUser = await User.findOne({
           $or: [{ email }, { phoneNumber }]
        });
        if (existingUser) {
            return res.status(400).json({
            message: "Email or phone number already exists"
            });
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        // 5. Generate verification token
        const token = crypto.randomBytes(32).toString("hex");
        // user creation
        const user = await User.create ({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            verificationToken: token,
            isVerified: false
        })

        // Create a 30-day token so the frontend can remember the user
        const authToken = jwt.sign(
            { role: "user", id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        await sendVerificationEmail({ fullName, email, token });
        // 10. Response
        res.status(201).json({
        success: true,
        message: "Signup successful. Check your email to verify.",
        email,
        token: authToken
        });
    }catch(err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

                // controller for verification 

const verifyEmail = async (req, res) => {
  try {
        const { token } = req.query;
        const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";

        if (!token) {
            return res.redirect(`${frontendBase}/verify-email?status=invalid`);
        }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.redirect(`${frontendBase}/verify-email?status=invalid`);
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    return res.redirect(`${frontendBase}/verify-email?status=success&email=${encodeURIComponent(user.email)}`);

  } catch (error) {
    console.log(error);
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendBase}/verify-email?status=error`);
  }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const email = req.body?.email || req.query?.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Friendly response to avoid forcing users back to signup flow.
            return res.status(200).json({
                success: true,
                message: "If this email exists and is not verified, a verification email has been sent."
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "This email is already verified. Please sign in."
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;
        await user.save();

        await sendVerificationEmail({ fullName: user.fullName, email: user.email, token });

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getVerificationStatus = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email }).select("email isVerified");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            email: user.email,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

    //   FOR POST SIGNIN
const postSignin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
      const user = await User.findOne({ email });
      if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"    
            })
        }
        // password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // fpr verification check 
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email before signing in"
            });
        }

        // Create a token after login
        const token = jwt.sign(
            { role: "user", id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) { 
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            user.resetPasswordToken = hashedResetToken;
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
            await user.save();

            await sendResetPasswordEmail({
                fullName: user.fullName,
                email: user.email,
                token: resetToken
            });
        }

        return res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a reset link has been sent.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token, password, and confirm password are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const hashedResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedResetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Reset link is invalid or has expired'
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now sign in.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('fullName email phoneNumber');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('getCurrentUserProfile error', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const phoneNumber = typeof req.body.phoneNumber === 'string' ? req.body.phoneNumber.trim() : '';
        const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
        const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';
        const confirmPassword = typeof req.body.confirmPassword === 'string' ? req.body.confirmPassword : '';
        const updates = {};

        if (phoneNumber) {
            if (phoneNumber !== user.phoneNumber) {
                const existingPhone = await User.findOne({
                    phoneNumber,
                    _id: { $ne: user._id }
                });

                if (existingPhone) {
                    return res.status(400).json({
                        success: false,
                        message: 'Phone number already exists'
                    });
                }

                updates.phoneNumber = phoneNumber;
            }
        }

        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required to change your password'
                });
            }

            if (!newPassword || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'New password and confirm password are required'
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            updates.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No changes provided'
            });
        }

        Object.assign(user, updates);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('updateUserSettings error', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
// Get user profile by email (used by frontend after Firebase auth)
export const getUserProfile = async (req, res) => {
    try {
        const email = req.query.email;
        console.log("Looking for email:", email); // ← add this

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email }).select('fullName email');
        console.log("Found user:", user); // ← add this

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: { fullName: user.fullName, email: user.email } });
    } catch (error) {
        console.error('getUserProfile error', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export {
    postSignup,
    verifyEmail,
    postSignin,
    resendVerificationEmail,
    getVerificationStatus,
    forgotPassword,
    resetPassword
}
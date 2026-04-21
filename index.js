import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

app.get("/users", (req, res) => {
    res.send(users);
})

app.post("/users", (req, res) => {
    const { name } = req.body;
    
    
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json({ 
        success: true,
        user: newUser,
        message: "User created successfully" 
    });
})

// app.patch("/users/:id", (req, res) => {
//     const user = users.find(u => u.id === parseInt(req.params.id));
//     if (!user) {
//         return res.status(404).json({ 
//             success: false,
//             message: "User not found" 
//         }); 
//     }

//     const { name } = req.body;
//     user.name = name || user.name;  
//     res.json({ 
//         success: true,
//         user,
//         message: "User updated successfully" 
//     });
// })

// app.put("/users/:id", (req, res) => {
//     const user = users.find(u => u.id === parseInt(req.params.id));
//     if (!user) {
//         return res.status(404).json({ 
//             success: false,
//             message: "User not found" 
//         }); 
//     }

//     const { id, name } = req.body;
//     user.name = name || user.name;  
//     user.id = id || user.id;

//     res.json({ 
//         success: true,
//         user,
//         message: "User updated successfully" 
//     });
// })

// app.get("/users/:id", (req, res) => {
//     const user = users.find(u => u.id === parseInt(req.params.id));
//     if (!user) {
//         return res.status(404).json({ 
//             success: false,
//             message: "User not found" 
//         });
//     }   

//     res.send(user);
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



// admin controller 
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ============================================
// ADMIN SIGNIN - Validate admin credentials
// ============================================
export const adminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        // Validate admin credentials from environment variables
        const validEmail = process.env.ADMIN_EMAIL;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (email !== validEmail || password !== validPassword) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid admin email or password" 
            });
        }

        // Create a JWT token for admin
        const token = jwt.sign(
            { role: "admin", email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );

        res.status(200).json({ 
            success: true,
            token,
            message: "Admin logged in successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// ============================================
// GET ALL USERS - Show list of all users
// ============================================
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from database
        const users = await User.find({}, "-password -verificationToken");
        // Note: "-password" hides the password field for security

        res.status(200).json({ 
            success: true,
            totalUsers: users.length,
            users,
            message: "Users retrieved successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// ============================================
// GET USER BY ID - Show specific user details
// ============================================
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user by ID
        const user = await User.findById(userId, "-password -verificationToken");

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true,
            user,
            message: "User retrieved successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// ============================================
// DELETE USER - Remove a user from database
// ============================================
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete user by ID
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true,
            message: "User deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// ============================================
// GET DASHBOARD STATS - Simple stats page
// ============================================
export const getDashboardStats = async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Count verified users
        const verifiedUsers = await User.countDocuments({ isVerified: true });

        // Count unverified users
        const unverifiedUsers = await User.countDocuments({ isVerified: false });

        res.status(200).json({ 
            success: true,
            stats: {
                totalUsers,
                verifiedUsers,
                unverifiedUsers
            },
            message: "Dashboard stats retrieved successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// admin model 
import { Router } from "express";
import { 
    adminSignIn, 
    getAllUsers, 
    getUserById, 
    deleteUser, 
    getDashboardStats 
} from "../controllers/adminController.js";

const router = Router();

// Admin Authentication
router.post("/signin", adminSignIn);

// Get Dashboard Stats
router.get("/dashboard", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.delete("/users/:userId", deleteUser);

export default router;
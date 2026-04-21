import jwt from "jsonwebtoken";

// @route POST /api/v1/admin/signin
// @desc  Admin SignIn

export const SignIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Email and password are required" 
        });
    }

    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1h" })
    console.log(token);

    res.status(200).json({ 
        success: true,
        token,
        message: "Admin signed in successfully" 
    });
}
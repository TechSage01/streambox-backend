import jwt from 'jsonwebtoken';

// Check if user is admin
export const verifyAdminToken = (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if role is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }

        // Token is valid, go to next function
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

import jwt from 'jsonwebtoken';

export const verifyUserToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'user') { { /* deny access */ }
            return res.status(403).json({
                success: false,
                message: 'User access only'
            });
        }

        req.user = decoded;  // Attach user info to request
        next(); // Allow request to proceed
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
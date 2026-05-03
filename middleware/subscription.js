import User from "../models/user.model.js";

export const isSubscribed = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isSubscribed) {
            return res.status(403).json({
                success: false,
                message: "Please subscribe to access this content"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
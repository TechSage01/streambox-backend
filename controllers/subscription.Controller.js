import https from 'https';
import User from '../models/user.model.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_API_KEY;

const PLANS = {
    basic: {
        name: 'Basic',
        amount: 80000, // in kobo (₦50)
        screens: 1,
        quality: 'SD',
        duration: 30 // days
    },
    standardAds: {
        name: 'Standard',
        amount: 150000,
        screens: 2,
        quality: 'HD',
        duration: 30 //days
    },
    standard: {
        name: 'Standard',
        amount: 350000,
        screens: 5,
        quality: 'HD',
        duration: 30
    },
    premium: {
        name: 'Premium',
        amount: 600000,
        screens: 8,
        quality: 'HD',
        duration: 30
    },
};

// Initializing payment 
// POST /api/v1/subscription/initialize
export const initializePayment = async(req, res) => {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan || !PLANS[plan]) {
        return res.status(400).json ({
            success: false,
            message: "Valid plan is required (basic, standard, premium)",
        });
    }
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json ({
                success: false,
                message: "User not Found",
            });
        }
        const selectedPlan = PLANS[plan];
        const params = JSON.stringify({
            email: user.email,
            amount: selectedPlan.amount,
            metadata: {
                userId: userId,
                plan: plan,
                fullName: user.fullName,
            },
            callback_url: `${process.env.FRONTEND_URL}/subscription/verify`,
        });
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                "Content-Type": "application/json",
            },
        };
        const paystackReq = https.request(options, (paystackRes) => {
            let data = "";
            paystackRes.on("data", (chunk) => (data += chunk));
            paystackRes.on("end", () => {
                const response = JSON.parse(data);
                if (response.status) {
                    return res.status(200).json({
                        success: true,
                        message: "Payment Initialized",
                        data: {
                            authorization_url: response.data.authorization_url,
                            reference: response.data.reference,
                            plan: selectedPlan,
                        },
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: response.message || "Failed to initialize payment",
                    });
                }
            });
        });
        paystackReq.on("error", (error) => {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        });

        paystackReq.write(params);
        paystackReq.end();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ─── VERIFY PAYMENT ───────────────────────────────────────────────────────────
// GET /api/v1/subscription/verify?reference=xxx
export const verifyPayment = async(req, res) => {
    const { reference } = req.query;
    
    if (!reference) {
        return res.status(400).json({
            success: false,
            message: "Payment reference is required"
        });
    }
    try {
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
        };
        const paystackReq = https.request(options, (paystackRes) => {
            let data = "";
            paystackRes.on("data", (chunk) => (data += chunk));
            paystackRes.on("end", async () => {
                const response = JSON.parse(data);
 
                if (response.status && response.data.status === "success") {
                    const { userId, plan } = response.data.metadata;
                    const selectedPlan = PLANS[plan];
 
                    // Calculate expiry date (30 days from now)
                    const expiry = new Date();
                    expiry.setDate(expiry.getDate() + selectedPlan.duration);
 
                    // Update user subscription in MongoDB
                    await User.findByIdAndUpdate(userId, {
                        isSubscribed: true,
                        subscriptionPlan: plan,
                        subscriptionExpiry: expiry,
                    });
 
                    return res.status(200).json({
                        success: true,
                        message: "Payment verified, subscription activated!",
                        data: {
                            plan: selectedPlan.name,
                            expiry,
                        },
                    });
                }else{
                    return res.status(400).json({
                        success: false,
                        message: "Payment verification failed",
                    });
                }
            });
        });
        paystackReq.on("error", (error) => {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        });
 
        paystackReq.end();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get subscription Status 
// GET /api/v1/subscription/status

export const getSubscriptionStatus = async (req, res) => {
    try {
        const user = await User.findById (req.user.id).select (
            "isSubscribed subscriptionPlan subscriptionExpiry"
        );
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isSubscribed && user.subscriptionExpiry < new Date()){
            await User.findByIdAndUpdate(req.user.id, {
                isSubscribed: false,
                subscriptionPlan: null,
                subscriptionExpiry: null,
            });
            return res.status(200).json({
                success: true,
                data: {
                    isSubscribed: false,
                    subscriptionPlan: null,
                    subscriptionExpiry: null,
                    message: "Your subscription has expired",
                },
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                isSubscribed: user.isSubscribed,
                subscriptionPlan: user.subscriptionPlan,
                subscriptionExpiry: user.subscriptionExpiry,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 
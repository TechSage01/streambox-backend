import mongoose from "mongoose";

let customerSchema =mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: [true, "Email has been taken, please choose another email"]},
    phoneNumber: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // subscription fields 
  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'pro'], default: 'null'     
  },
  subscriptionExpiry: { 
    type: Date,
    default: null
  }
}, { timestamps: true })

const User = mongoose.model("User", customerSchema);

export default User;
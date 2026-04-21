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
  resetPasswordExpires: Date
})

const User = mongoose.model("User", customerSchema);

export default User;
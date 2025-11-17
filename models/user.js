// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true,
      default: "customer"
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    img: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

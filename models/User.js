// import { Schema, Model, Document, model } from "mongoose";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const objectId = mongoose.Schema.Types.ObjectId;



const userSchema = new mongoose.Schema(
  {
    _id: {
      type: objectId,
      auto: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // Add a method to encrypt the password
    },
    role: {
      type: String,
      enum: ["customer", "support", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;

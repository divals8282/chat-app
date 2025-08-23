import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  nickname: String,
  refreshToken: String,
});

export const UserModel = mongoose.model("User", userSchema);

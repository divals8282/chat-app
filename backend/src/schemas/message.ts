import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  userId: String,
  message: String,
});

export const MessageModel = mongoose.model("Message", messageSchema);

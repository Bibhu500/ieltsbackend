import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    sender_id: { type: String, required: true },
    sender_name: { type: String, required: true },
    receiver_id: { type: String, required: true },
    result_id: { type: String, required: true },
    result_link: { type: String, required: true },
    message_type: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export {Notification};
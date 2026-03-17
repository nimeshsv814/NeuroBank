import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "suspended"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Account", accountSchema);

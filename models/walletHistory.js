// walletHistory.js
import mongoose from "mongoose";

const walletHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WalletHistory = mongoose.model("walletHistories", walletHistorySchema);
export default WalletHistory;

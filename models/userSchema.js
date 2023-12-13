import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        wallet: {
            type: Number,
            default: 0,
        },
        status: {
            type: Boolean,
            default: true

        },
        walletHistory: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "WalletHistory",
            },
          ],
    },
    {
        timestamps: true,
      },
);

const User = mongoose.model('users', userSchema);
export default User;
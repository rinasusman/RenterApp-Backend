import mongoose from "mongoose";

const feedbackModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },

        homeId: {
            type: mongoose.Types.ObjectId,
            ref: 'home',
            required: true,
        },

        star: {
            type: String,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
        createDate: {
            type: Date,
            default: Date.now()
        },

    },
);
const Feedback = mongoose.model("feedback", feedbackModel);
export default Feedback;
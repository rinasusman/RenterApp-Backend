import mongoose from "mongoose";

const homeModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },

        category: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        guestCount: {
            type: Number,
            required: true,
        },
        roomCount: {
            type: Number,
            required: true,
        },
        bathroomCount: {
            type: Number,
            required: true,
        },
        imageSrc: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            required: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
);
const Home = mongoose.model("home", homeModel);
export default Home;
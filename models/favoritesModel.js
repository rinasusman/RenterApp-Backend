import mongoose from "mongoose";

const favoritesModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true,
        },
        item: [{
            home: {
                type: mongoose.Types.ObjectId,
                ref: 'home',
                required: true,
            }
        }],
    },
);
const Favorites = mongoose.model("favorites", favoritesModel);
export default Favorites;
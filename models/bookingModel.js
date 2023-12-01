import mongoose from "mongoose";

const bookingModel = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        item: [{
            home: {
                type: mongoose.Types.ObjectId,
                ref: 'home',
                required: true,
            }
        }],
        totalPrice: {
            type: String,
            required: true,
        },
        startDate: {
            type: String,


        },
        endDate: {
            type: String,

        },
        bookingDate: {
            type: Date,
            default: Date.now()
        },
        cancelDate: {
            type: Date,

        },
        checkoutDate: {
            type: Date,

        },
        checkinDate: {
            type: Date,

        },
        paymentType: {
            type: String,
        },
        status: {
            type: String,
            default: "Booked"
        },
    },
);
const Booking = mongoose.model("booking", bookingModel);
export default Booking;
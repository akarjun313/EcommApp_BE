import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 100
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending",
        enum: [
            "In-transit", "Delivered", "Cancelled", "Pending",
        ]
    },
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    address: {
        //buyer address
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        landmark: {
            type: String,
            required: true
        },
        phone : {
            type : Number,
        },
        addressDetail: {
            type: String,
            required: true
        }
    }
}, { timestamps: true })

const Bookings = mongoose.model('Bookings', bookingSchema)
export default Bookings
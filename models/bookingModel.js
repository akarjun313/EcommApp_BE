import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    buyer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    seller : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity : {
        type : Number,
        required : true,
        min: 1,
        max: 10
    },
    totalPrice : {
        type: Number,
        required: true,
        min: 100
    },
    date : {
        type: Date,
        default: Date.now
    }
},{ timestamps: true })

const Bookings = mongoose.model('Bookings', bookingSchema)
export default Bookings
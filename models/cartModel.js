import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    quantity : {
        type : Number,
        required : true,
        default : 1,
        min : 1,
        max : 5
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
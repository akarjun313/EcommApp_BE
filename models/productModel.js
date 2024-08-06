import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    brand : {
        type: String,
        required : true,
        minLength : 1,
        maxLength : 50
    },
    model : {
        type: String,
        required : true,
        minLength : 1,
        maxLength : 50,
    },
    price : {
        type: Number,
        required : true,
        min : 100,
        max : 999999
    },
    stock : {
        type : Number,
        required : true,
        min : 0
    },
    image : [{
        type : String,
        required : true
    }],
    usedFor : {
        type : String,
        required : true,
        enum : ["men", "women", "kids","unisex"]
    },
    category : {
        type : String,
        required : true,
        enum : ["smart watch", "analog", "digital", "analog-digital"]
    },
    occassion : {
        type : String,
        required : true,
        enum : ["casual", "formal", "party", "sporty", "sport", "casual-sport", "casual-formal", "casual-party", "formal-party"]
    },
    warranty : {
        type : Number,
        max : 5
    },
    description : {
        type : String,
        maxLength : 500
    },
    rating : {
        type : Number,
        default : 1
    },
    status : {
        type : Boolean,
        default : false,
        required : true
    }
}, { timestamps: true })

const Product = mongoose.model('product', productSchema)
export default Product
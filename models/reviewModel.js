import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    review : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 300
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    }
},{ timestamps: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review

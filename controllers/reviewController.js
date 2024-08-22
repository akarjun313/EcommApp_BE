import { findUser } from "../logic/basic-logic/findUser.js"
import Bookings from "../models/bookingModel.js"
import Product from "../models/productModel.js"
import Review from "../models/reviewModel.js"

// FOR USERS 

// add review
export const addReview = async (req, res) => {
    try {
        // id of the booking
        const { id } = req.params

        const { rating, review } = req.body.data

        //getting booking details
        const bookingDetails = await Bookings.findById(id)
        if(!bookingDetails) return res.json({ message: 'Booking not found', success: false })


        //check if user already added review
        const findReview = await Review.find({ $and: [{ user: bookingDetails.buyer }, { product: bookingDetails.product }] })
        if (findReview.length != 0) {
            return res.json({ message: "Already added review", success: false })
        }
        console.log(findReview)

        if(bookingDetails.status !== 'Delivered'){
            return res.json({ message: 'Product must be delivered first', success: false })
        }

        //add review
        const newReview = new Review({
            rating,
            review,
            user: bookingDetails.buyer,
            product: bookingDetails.product
        })

        //save review
        const saveReview = await newReview.save()
        if(!saveReview) return res.json({ message: "Failed, error in adding review", success: false })


        // Update product rating
        const reviews = await Review.find({ product: bookingDetails.product })
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
        const averageRating = totalRating / reviews.length

        await Product.findByIdAndUpdate(bookingDetails.product, { rating: averageRating })

        return res.status(200).json({ message: 'Review added successfully', success: true })
        
    } catch (error) {
        console.log('Error in adding new review', error)
        res.status(500).json({ message: 'Error in adding new review', success: false })
    }
}

// show reviews
export const showReviews = async (req, res) => {
    try {
        //Product id
        const {id} = req.params
        console.log("Product id :", id)

        //fetching reviews
        const showReviews = await Review.find({ product: id })
        if(showReviews.length === 0) return res.json({ message: "No reviews found", success: false })

        return res.status(200).json({ message: showReviews, success: true })

    } catch (error) {
        console.log('Error in displaying reviews', error)
        res.status(500).json({ message: 'Error in displaying reviews', success: false })
    }
} 


// delete review
export const deleteReview = async (req, res) => {
    try {
        //review id
        const {id} = req.params

        //find user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }

        //find review
        const findReview = await Review.findById(id)
        if(!findReview) return res.status(400).json({ message: 'Review not found', success: false })

        //check if review belongs to user
        if(findReview.user !== user._id) return res.status(400).json({ message: 'Only review owner can delete the review', success: false })

        //delete review
        const deleteReview = await Review.findByIdAndDelete(id)
        if(!deleteReview) return res.status(400).json({ message: 'Error in deleting review', success: false })
        
        return res.status(200).json({ message: 'Review deleted', success: true })
        
    } catch (error) {
        console.log('Error in deleting review', error)
        res.status(500).json({ message: 'Error in deleting review', success: false })
    }
}

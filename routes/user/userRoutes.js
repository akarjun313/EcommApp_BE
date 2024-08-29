import express, { Router } from 'express'
import { checkUser, userCheck, userLogout, userSignin, userSignup } from '../../controllers/userController.js'
import { showAllProducts, showProduct, showTopNew, showTopRated } from '../../controllers/product/userPController.js'
import { addToCart, editCart, getCountsFromCart, remFromCart, showCart } from '../../controllers/cartController.js'
import authenticateUser from '../../middlewares/authentication/userAuth.js'
import { addReview, showReviews } from '../../controllers/reviewController.js'
import { createOrder, showOrders, verify } from '../../controllers/bookingController.js'


const userRouter = Router()

userRouter.get('/', (req, res) => {
    console.log("User Router")
    res.send("User Router")
})

userRouter.post('/signup', userSignup) //sign-up
userRouter.post('/login', userSignin) //user sign-in
userRouter.post('/logout', userLogout) //logout

userRouter.get('/user-check', authenticateUser, userCheck) //for navbar
userRouter.get('/authenticate-user', authenticateUser, checkUser) //for FE


userRouter.get('/listing', showAllProducts) //show watches
userRouter.get('/product/:id', showProduct) //show one product in detail


//AUTHENTICATION NEEDED


userRouter.post('/add-to-cart/:id', authenticateUser, addToCart) //add to cart
userRouter.patch('/edit-cart/:id', authenticateUser, editCart) //edit cart
userRouter.get('/cart', authenticateUser, showCart) //view cart
userRouter.delete('/delete-cart/:id', authenticateUser, remFromCart) //delete from cart

//buy
userRouter.post('/booking', authenticateUser, createOrder)    //razorpay payment creation
userRouter.post('/verify-payment', authenticateUser, verify)  //Razorpay verification & DB saving

userRouter.get('/my-orders', authenticateUser, showOrders)    //view orders

//REVIEWS SECTION
userRouter.post('/add-review/:id', authenticateUser, addReview)    //write review
//delete review
userRouter.get('/show-reviews/:id', showReviews)    //view reviews

userRouter.get('/top-rated', showTopRated)      //shows 4 top rated products
userRouter.get('/new-products', showTopNew)     // Shows 4 lately added products
userRouter.get('/count-cart', getCountsFromCart)    //count cart for navbar


export default userRouter
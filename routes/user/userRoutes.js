import express, { Router } from 'express'
import { userSignin, userSignup } from '../../controllers/userController.js'
import { showAllProducts, showProduct } from '../../controllers/product/userPController.js'
import { addToCart, editCart, remFromCart, showCart } from '../../controllers/cartController.js'
import authenticateUser from '../../middlewares/authentication/userAuth.js'


const userRouter = Router()

userRouter.get('/', (req, res) => {
    console.log("User Router")
    res.send("User Router")
})

userRouter.post('/signup', userSignup) //sign-up
userRouter.post('/login', userSignin) //user sign-in
userRouter.post('/logout', ) //logout


userRouter.get('/listing', showAllProducts) //show watches
userRouter.get('/product/:id', showProduct) //show one product in detail


//AUTHENTICATION NEEDED


userRouter.post('/add-to-cart/:id', authenticateUser, addToCart) //add to cart
userRouter.patch('/edit-cart/:id', authenticateUser, editCart) //edit cart
userRouter.get('/cart', authenticateUser, showCart) //view cart
userRouter.delete('/delete-cart/:id', authenticateUser, remFromCart) //delete from cart

//buy
//view orders
//write review
//delete review

export default userRouter
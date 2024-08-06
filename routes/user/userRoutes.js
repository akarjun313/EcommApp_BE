import express, { Router } from 'express'
import { userSignin, userSignup } from '../../controllers/userController.js'


const userRouter = Router()

userRouter.get('/', (req, res) => {
    console.log("User Router")
    res.send("User Router")
})

userRouter.post('/signup', userSignup)
userRouter.post('/login', userSignin)
userRouter.post('/logout', )

//show watches
//add to cart
//buy
//delete from cart
//view orders
//write review
//delete review

export default userRouter
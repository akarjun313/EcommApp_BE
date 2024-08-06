import express, { Router } from 'express'
import { adminSignin } from '../../controllers/adminController.js'


const adminRouter = Router()

adminRouter.get('/', (req, res) => {
    console.log("Admin Router")
    res.send("Admin Router")
})

// for sign-In
adminRouter.post('/sign-in', adminSignin)

// for sign-out
adminRouter.post('/logout', )

// view seller list 
// view products list

export default adminRouter
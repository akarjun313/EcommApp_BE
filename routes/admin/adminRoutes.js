import express, { Router } from 'express'
import { adminSignin } from '../../controllers/adminController.js'
import { approveProduct } from '../../controllers/product/adminPController.js'
import authenticateAdmin from '../../middlewares/authentication/adminAuth.js'


const adminRouter = Router()

adminRouter.get('/', (req, res) => {
    console.log("Admin Router")
    res.send("Admin Router")
})

// for sign-In
adminRouter.post('/sign-in', adminSignin)

// for sign-out
adminRouter.post('/logout', )

//change product status
adminRouter.patch('/change-status/:id', authenticateAdmin, approveProduct)

// view seller list 
// view products list

export default adminRouter
import express, { Router } from 'express'
import { adminSignin, checkAdmin, logoutAdmin } from '../../controllers/adminController.js'
import { approveProduct, getAllProducts } from '../../controllers/product/adminPController.js'
import authenticateAdmin from '../../middlewares/authentication/adminAuth.js'
import { userList } from '../../controllers/userController.js'


const adminRouter = Router()

adminRouter.get('/', (req, res) => {
    console.log("Admin Router")
    res.send("Admin Router")
})


adminRouter.post('/sign-in', adminSignin)   // for sign-In
adminRouter.post('/logout', logoutAdmin)   //admin logout

adminRouter.get('/authenticate-admin', authenticateAdmin, checkAdmin)   //for FE authentification

adminRouter.patch('/change-status/:id', approveProduct)  //change product status

adminRouter.get('/get-all-products', getAllProducts)    //fetching all products and its seller details


adminRouter.get('/dashboard-readings', userList)    // Admin gets all users, sellers & product count

export default adminRouter
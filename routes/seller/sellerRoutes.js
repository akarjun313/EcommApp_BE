import express, { Router } from 'express'
import upload from '../../middlewares/multer/multerMiddleware.js'
import { adCount, addProduct, editProduct, removeProduct, totalSalesAndProfit, viewMyProducts } from '../../controllers/product/sellerPController.js'
import authenticateSeller from '../../middlewares/authentication/sellerAuth.js'
import { checkSeller } from '../../controllers/userController.js'
import { changeOrderStatus, viewAllOrders } from '../../controllers/bookingController.js'


const sellerRouter = Router()

sellerRouter.get('/', (req, res) => {
    console.log("Seller Router")
    res.send("Seller Router")
})

sellerRouter.get('/authenticate-seller', authenticateSeller, checkSeller)   //for FE

sellerRouter.post('/add-product', authenticateSeller, upload.array('images', 6), addProduct)    //add watches


//view watch

sellerRouter.patch('/edit-product/:id', authenticateSeller, editProduct)    //edit watch

sellerRouter.delete('/remove-product/:id', authenticateSeller, removeProduct)   //delete watch

sellerRouter.get('/my-products', authenticateSeller, viewMyProducts)    //view all watches


//view pending orders

sellerRouter.get('/orders', authenticateSeller, viewAllOrders)   //view all orders
sellerRouter.patch('/change-order-status/:id', authenticateSeller, changeOrderStatus) //change order status

sellerRouter.get('/ad-count', authenticateSeller, adCount) //show active and inactive ad count
sellerRouter.get('/sales-and-profit', authenticateSeller, totalSalesAndProfit)  //show total sales & profit

export default sellerRouter
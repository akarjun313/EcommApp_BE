import express, { Router } from 'express'
import upload from '../../middlewares/multer/multerMiddleware.js'
import { addProduct, editProduct, removeProduct } from '../../controllers/product/sellerPController.js'
import authenticateSeller from '../../middlewares/authentication/sellerAuth.js'


const sellerRouter = Router()

sellerRouter.get('/', (req, res) => {
    console.log("Seller Router")
    res.send("Seller Router")
})


sellerRouter.post('/add-product', authenticateSeller, upload.array('images', 6), addProduct)    //add watches


//view watch

sellerRouter.patch('/edit-product/:id', editProduct)    //edit watch

sellerRouter.delete('/remove-product/:id', removeProduct)   //delete watch

//view all watches

//view pending orders
//view all orders

export default sellerRouter
import express, { Router } from 'express'
import upload from '../../middlewares/multer/multerMiddleware.js'
import { addProduct } from '../../controllers/product/sellerPController.js'


const sellerRouter = Router()

sellerRouter.get('/', (req, res) => {
    console.log("Seller Router")
    res.send("Seller Router")
})

//add watches
sellerRouter.post('/add-product', upload.array('images', 6), addProduct)


//view watches
//edit watches
//delete watches


export default sellerRouter
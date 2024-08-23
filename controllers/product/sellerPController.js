import { cloudinaryInstance } from "../../config/cloudinary/cloudinary.js"
import { findUser } from "../../logic/basic-logic/findUser.js"
import { changePrice, changeStock } from "../../logic/product-controller/productLogic.js"
import Bookings from "../../models/bookingModel.js"
import Product from "../../models/productModel.js"
import fs from 'fs'


//adding product for sale
export const addProduct = async (req, res) => {
    try {

        // checking images have been uploaded or not  
        if (!req.files || req.files.length === 0) {
            console.log("no file uploaded")
            return res.json({ message: 'No file uploaded', success: false })
        }
        
        // uploading image to cloudinary
        let imageUrl = []
        for (const file of req.files) {
            try {
                const result = await cloudinaryInstance.uploader.upload(file.path, {
                    folder: "products" // Stores all images in this folder of cloudinary
                })
                imageUrl.push(result.url)

                // Remove the file from local storage after upload
                fs.unlink(file.path, (err) => {
                    if (err) console.error("Error deleting file from local storage", err)
                })
            } catch (err) {
                console.log("error in cloudinary upload", err)
                return res.json({ message: "Error in image uploading", success: false })
            }
        }

        const { brand, model, price, stock, usedFor, category, occassion, warranty, description } = req.body

        //find user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.json({ message: "Error in finding user", success: false })
        }
        if (user.role !== 'seller') {
            return res.json({ message: 'Only a seller can add the product', success: false })
        }

        const addNewProduct = new Product({
            brand,
            model,
            price,
            stock,
            image: imageUrl,
            usedFor,
            category,
            occassion,
            warranty,
            description,
            seller: user._id
        })

        const newProduct = await addNewProduct.save()
        if (!newProduct) return res.json({ message: 'Product adding failed', success: false })

        return res.status(200).json({ message: 'Product added successfully', success: true })

    } catch (error) {
        console.log("error in adding product", error)
        res.status(500).json({ message: "error in adding product", success: false })
    }
}

// Removing product 
export const removeProduct = async (req, res) => {
    try {
        //product id
        const { id } = req.params

        //find product
        const product = await Product.findById(id)
        if (!product) return res.status(400).json({ message: 'Product not found', success: false })

        //check if product is in-transit or pending
        const productInBooking = await Bookings.find({ $and: [{ product: id }, { status: ["In-transit", "Pending"] }] })
        if (productInBooking.length > 0) return res.status(400).json({ message: "Product in-transit or pending", success: false })

        //getting image urls
        const imageUrls = product.image

        //deleting images from cloudinary
        for (const imageUrl of imageUrls) {
            try {
                const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0]
                const response = await cloudinaryInstance.uploader.destroy(publicId)
                if (response.result === "not found") {
                    return res.status(404).json({ message: "Image not found", success: false })
                } else if (response.result !== 'ok') {
                    return res.status(400).json({ message: "Failed to delete image", success: false })
                }
            } catch (error) {
                console.log("error in deleting image from cloudinary", error)
                return res.status(500).json({ message: "Error in deleting image from cloudinary", success: false })
            }
        }

        //delete product
        const deleteProduct = await Product.deleteOne({ _id: id })
        if (!deleteProduct) return res.status(400).json({ message: 'Failed to delete', success: false })

        //delete reviews
        const deleteReviews = await Review.deleteMany({ product: id })
        if (!deleteReviews) return res.status(400).json({ message: 'Failed to delete reviews', success: false })


        return res.status(200).json({ message: 'Product deleted successfully', success: true })
    } catch (error) {
        console.log("error in removing product", error)
        res.status(500).json({ message: "error in removing product", success: false })
    }
}


// Editing the product 
export const editProduct = async (req, res) => {
    try {
        //product id
        const { id } = req.params

        const { price, stock } = req.body

        //find product existance
        const product = await Product.findById(id)
        if (!product) return res.status(400).json({ message: 'Product not found', success: false })

        //product updation conditions
        if (price && stock) {
            const successP = await changePrice(id, price)
            const successS = await changeStock(id, stock)
            if (successP && successS) {
                return res.status(200).json({ message: 'Product price and stock updated successfully', success: true })
            } else {
                return res.status(400).json({ message: 'Product price or stock updation failed', success: false })
            }
        } else if (price) {
            const success = await changePrice(id, price)
            if (success) {
                return res.status(200).json({ message: 'Product price updated successfully', success: true })
            } else {
                return res.status(400).json({ message: 'Product price updation failed', success: false })
            }
        } else if (stock) {
            const success = await changeStock(id, stock)
            if (success) {
                return res.status(200).json({ message: 'Product stock updated successfully', success: true })
            } else {
                return res.status(400).json({ message: 'Product stock updation failed', success: false })
            }
        } else {
            return res.status(400).json({ message: 'Please provide price or stock', success: false })
        }

    } catch (error) {
        console.log("error in editing product", error)
        res.status(500).json({ message: "error in editing product", success: false })
    }
}

export const viewMyProducts = async (req, res) => {
    try {
        //find user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }

        const myProducts = await Product.find({ seller: user._id })
        if (!myProducts || myProducts.length === 0) return res.json({ message: 'No products', success: false })

        return res.status(200).json({ message: myProducts, success: true })
    } catch (error) {
        console.log("Error in displaying my products", error)
        res.status(500).json({ message: "Error in displaying my products", success: false })
    }
}


//FOR DASHBOARD DATAS

export const adCount = async (req, res) => {
    try {
        
        //find user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }

        //find products
        const allProducts = await Product.find({ seller: user._id })
        if (!allProducts || allProducts.length === 0) return res.json({ message: 'No products', success: false })

        const totalProducts = allProducts.length
        const activeProducts = allProducts.filter(product => product.status === true).length
        const inactiveProducts = allProducts.filter(product => product.status === false).length


        return res.status(200).json({ totalProducts, activeProducts, inactiveProducts, success: true })

    } catch (error) {
        console.log("Error occured in adCount", error)
        res.status(500).json({ message: "Error occured in finding count of ads", success: false })
    }
}

//finding total sales & profit
export const totalSalesAndProfit = async (req, res) => {
    try {
        //find user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }

        //find total sales
        const totalSales = await Bookings.find({ seller: user._id, status: { $ne: 'Cancelled' } })
        if (!totalSales || totalSales.length === 0) return res.json({ message: 'No sales found', success: false })

        //find total profit
        const totalProfit = totalSales.reduce((acc, sale) => acc + sale.totalPrice, 0)

        return res.status(200).json({
            totalSales: totalSales.length,
            totalProfit,
            success: true
        })
    } catch (error) {
        console.log("Error in finding total sales & profit", error)
        res.status(500).json({ message: "Error in finding total sales & profit", success: false })
    }
}
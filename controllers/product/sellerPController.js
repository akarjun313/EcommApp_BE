import { cloudinaryInstance } from "../../config/cloudinary/cloudinary.js"
import { changePrice, changeStock } from "../../logic/product-controller/productLogic.js"
import Product from "../../models/productModel.js"


//adding product for sale
export const addProduct = async (req, res) => {
    try {

        // checking images have been uploaded or not 
        if(!req.files || req.files.length === 0){
            console.log("no file uploaded")
            return res.status(400).json({ message: 'No file uploaded', success: false })
        }

        // uploading image to cloudinary
        let imageUrl = []
        for(const file of req.files){
            try {
               const result = await cloudinaryInstance.uploader.upload(file.path)
               imageUrl.push(result.url)
            } catch (err) {
                console.log("error in cloudinary upload", err)
                return res.status(400).json({ message: "Error in image uploading", success: false })
            }
        }
        
        const { brand, model, price, stock, usedFor, category, occassion, warranty, description} = req.body

        const addNewProduct = new Product({
            brand,
            model,
            price,
            stock,
            image : imageUrl,
            usedFor,
            category,
            occassion,
            warranty,
            description
        })

        const newProduct = await addNewProduct.save()
        if(!newProduct) return res.status(400).json({ message: 'Product adding failed', success: false })

        return res.status(200).json({ message: 'Product added successfully', success: true })

    } catch (error) {
        console.log("error in adding product", error)
        res.status(500).json({ message: "error in adding product", success: false })
    }
}

// Removing product 
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deleteProduct = await Product.findByIdAndDelete(id)
        if(!deleteProduct) return res.status(400).json({ message: 'Product not found', success: false })

        return res.status(200).json({ message: 'Product deleted successfully', success: true })
    } catch (error) {
        console.log("error in removing product", error)
        res.status(500).json({ message: "error in removing product", success: false })
    }
}


// Editing the product 
export const editProduct = async (req, res) => {
    try {
        const { id } = req.params

        const { price, stock } = req.body

        const product = await Product.findById(id)
        if(!product) return res.status(400).json({ message: 'Product not found', success: false })

        if(price){
            const success = await changePrice(id, price)
            if(success){
                return res.status(200).json({ message: 'Product price updated successfully', success: true })
            }else{
                return res.status(400).json({ message: 'Product price updation failed', success: false })
            }
        }else if(stock){
            const success = await changeStock(id, stock)
            if(success){
                return res.status(200).json({ message: 'Product stock updated successfully', success: true })
            }else{
                return res.status(400).json({ message: 'Product stock updation failed', success: false })
            }
        }else if(price && stock){
            const successP = await changePrice(id, price)
            const successS = await changeStock(id, stock)
            if(successP && successS){
                return res.status(200).json({ message: 'Product price and stock updated successfully', success: true })
            }else{
                return res.status(400).json({ message: 'Product price or stock updation failed', success: false })
            }
        }else{
            return res.status(400).json({ message: 'Please provide price or stock', success: false })
        }

    } catch (error) {
        console.log("error in editing product", error)
        res.status(500).json({ message: "error in editing product", success: false })
    }
}
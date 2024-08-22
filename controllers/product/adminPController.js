import Product from "../../models/productModel.js"
import User from "../../models/userModel.js"


//approve product for sale
export const approveProduct = async (req, res) => {
    try {
        //product id
        const { id } = req.params

        const { status } = req.body

        const approveProduct = await Product.findOneAndUpdate(
            { _id: id },
            { status }
        )
        if (!approveProduct) return res.status(400).json({ message: 'Product was not approved, Failed', success: false })

        return res.status(200).json({ message: 'Product status have been changed', success: true })
    } catch (error) {
        console.log("error in admin product approval", error)
        res.status(500).json({ message: "error in admin product approval", success: false })
    }
}


//get all products & it's seller details
export const getAllProducts = async (req, res) => {
    try {

        //finding products
        const products = await Product.find()
        if (!products || products.length === 0) {
            return res.json({ message: 'No product found', success: false })
        }

        // Map through each product to fetch seller details
        const productsWithSellers = await Promise.all(products.map(async (product) => {
            // Fetch the seller details
            const seller = await User.findById(product.seller)

            // Replace seller _id with seller details
            return {
                ...product._doc, // Spread product details
                seller // Include seller details
            }
        }))

        return res.status(200).json({ products: productsWithSellers, success: true })
    } catch (error) {
        console.log("Error in fetching products", error)
        res.status(500).json({ message: "Error in fetching products", success: false })
    }
}


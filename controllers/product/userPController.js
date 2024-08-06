import Product from "../../models/productModel.js"


// user view Product 
export const showProduct = async (req, res) => {
    try {
        const { id } = req.params

        const viewProduct = await Product.findById(id)
        if(!viewProduct) return res.status(400).json({ message: 'Product not found', success: false })

        return res.status(200).json({ message: viewProduct, success: true })
    } catch (error) {
        console.log("error in showing product", error)
        res.status(500).json({ message: "error in showing product", success: false })
    }
}
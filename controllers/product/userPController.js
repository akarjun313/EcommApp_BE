import Product from "../../models/productModel.js"


// user view Product 
export const showProduct = async (req, res) => {
    try {
        const { id } = req.params

        const viewProduct = await Product.findById(id)
        if(!viewProduct) return res.status(400).json({ message: 'Product not found', success: false })
        if(viewProduct.status !== true) return res.status(400).json({ message: 'product not approved', success: false })
        

        return res.status(200).json({ message: viewProduct, success: true })
    } catch (error) {
        console.log("error in showing product", error)
        res.status(500).json({ message: "error in showing product", success: false })
    }
}

//show all product
export const showAllProducts = async (req, res) => {
    try {
        //list products which status is true
        const allProducts = await Product.find({ status: true })
        if(!allProducts) return res.status(400).json({ message: 'No products found', success: false })
        
        
        return res.status(200).json({ message: allProducts, success: true })
    } catch (error) {
        console.log("Error in product listing", error)
        res.status(500).json({ message: "Error in product listing", success: false })
    }
}
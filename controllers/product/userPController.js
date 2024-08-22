import Product from "../../models/productModel.js"


// user view Product 
export const showProduct = async (req, res) => {
    try {
        
        const { id } = req.params
        
        const viewProduct = await Product.findById(id)
        if(!viewProduct) return res.json({ message: 'Product not found', success: false })
        if(viewProduct.status !== true) return res.json({ message: 'product not approved', success: false })
        

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
        if(!allProducts) return res.json({ message: 'No products found', success: false })
        
        
        return res.status(200).json({ message: allProducts, success: true })
    } catch (error) {
        console.log("Error in product listing", error)
        res.status(500).json({ message: "Error in product listing", success: false })
    }
}


//show 4 Top rated products
export const showTopRated = async (req, res) => {
    try {
        // console.log("hitted on top rated products")
        const topRated = await Product.find({ status: true }).sort({ rating: -1 }).limit(4)
        if(topRated.length === 0) return res.json({ message: 'No top rated products found', success: false })
        
        return res.status(200).json({ message: topRated, success: true })
    } catch (error) {
        console.log("Error in top rated product listing", error)
        res.status(500).json({ message: "Error in top rated product listing", success: false })
    }
}

//show top 4 new products(latest added)
export const showTopNew = async (req, res) => {
    try {
        // console.log("hitted on new products")
        const topNew = await Product.find({ status: true }).sort({ createdAt: -1 }).limit(4)
        if(topNew.length === 0) return res.json({ message: 'No new products found', success: false })

        // console.log("top new",topNew)
        return res.status(200).json({ message: topNew, success: true })

    } catch (error) {
        console.log("Error in new product listing", error)
        res.status(500).json({ message: "Error in new product listing", success: false })
    }
}
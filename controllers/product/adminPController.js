import Product from "../../models/productModel.js"


//approve product for sale
export const approveProduct = async (req, res) => {
    try {
        const { id } = req.params

        const { status } = req.body

        const approveProduct = await Product.findOneAndUpdate(
            {_id : id},
            {status}
        )
        if(!approveProduct) return res.status(400).json({ message: 'Product was not approved, Failed', success: false })

        return res.status(200).json({ message: 'Product status have been changed', success: true })
    } catch (error) {
        console.log("error in admin product approval", error)
        res.status(500).json({ message: "error in admin product approval", success: false })
    }
}


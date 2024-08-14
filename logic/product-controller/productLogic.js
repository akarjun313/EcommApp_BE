import Product from "../../models/productModel.js"


//to update product price
export const changePrice = async (id, price) => {
    try {
        const priceChange = await Product.findOneAndUpdate(
            {_id : id},
            {price}
        )
        if(!priceChange){
            console.log("error in updating price")
            return false
        }
        
        return true
    } catch (error) {
        console.log("error in price updation", error)
        return false
    }
}

// to update stocks
export const changeStock = async (id, stock) => {
    try {
        const stockChange = await Product.findOneAndUpdate(
            {_id : id},
            {stock}
        )
        if(!stockChange){
            console.log("error in updating stocks")
            return false
        }
        
        return true
    } catch (error) {
        console.log("error in stock updation", error)
        return false
    }
}


//delete product image from cloudinary
//code here
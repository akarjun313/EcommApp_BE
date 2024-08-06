import { findUser } from "../logic/basic-logic/findUser.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"


// FOR USERS 
//add to cart
export const addToCart = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body

        const findProduct = await Product.findById(id)
        if (!findProduct) {
            return res.status(400).json({ message: 'Product not found', success: false })
        }

        if (findProduct.stock < quantity) {
            return res.status(400).json({ message: 'Product out of stock', success: false })
        }

        const user = await findUser()

        //Adding product to cart
        if (user) {
            const addToCart = new Cart({
                quantity,
                product: id,
                buyer: user
            })

            const newCart = await addToCart.save()
            if (!newCart) return res.status(400).json({ message: 'Product not added to cart', success: false })
        }else{
            return res.status(400).json({ message: 'User not found', success: false })
        }

        res.status(200).json({ message: 'Product added to cart', success: true })
    } catch (error) {
        console.log("Error in adding product to cart", error)
        res.status(500).json({ message: "Error in adding product to cart", success: false })
    }
}

//edit cart
export const editCart = async (req, res) => {
    try {
        // cart id 
        const { id } = req.params

        // quantity in No.s
        const { quantity } = req.body

        const editCart = await Cart.findOneAndUpdate(
            { _id: id },
            { quantity }
        )
        if (!editCart) return res.status(400).json({ message: 'Cart not found', success: false })

        return res.status(200).json({ success: true })


    } catch (error) {
        console.log("error in cart editing", error)
        res.status(500).json({ message: "error in cart editing", success: false })
    }
}

//show cart
export const showCart = async (req, res) => {
    try {
        
        
        const user = await findUser()
        if (user === false) return res.status(400).json({ message: 'User not found', success: false })

        const cart = await Cart.find({ buyer : user._id })
        if (!cart) return res.status(400).json({ message: 'Cart is empty', success: false })
        
        return res.status(200).json({ message: cart, success: true })

    } catch (error) {
        console.log("error in displaying cart", error)
        res.status(500).json({ message: "error in displaying cart", success: false })
    }
}

// remove product from cart
export const remFromCart = async (req, res) => {
    try {
        const {id} = req.params

        const remProduct = await Cart.findByIdAndDelete(id)
        if(!remProduct) return res.status(400).json({ message: 'Product not found', success: false })

        return res.status(200).json({ message: 'Product removed from cart', success: true })
    } catch (error) {
        console.log("Error in removing product from cart", error)
        res.status(500).json({ message: "Error in removing product from cart", success: false })
    }
}

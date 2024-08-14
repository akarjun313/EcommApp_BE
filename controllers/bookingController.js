import { findUser } from "../logic/basic-logic/findUser.js"
import Bookings from "../models/bookingModel.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

//buy from cart
export const bookProduct = async (req, res) => {
    try {
        //cart id
        const { id } = req.params

        const cartDetails = await Cart.findById(id)
        if(!cartDetails) return res.status(400).json({ message: 'fetching cart details failed', success: false })

        const product = await Product.findById(cartDetails.product)
        if(!product) return res.status(400).json({ message: 'Product not found', success: false })

        if(product.stock < cartDetails.quantity || product.stock === 0) return res.status(400).json({ message: 'Out of stock', success: false })

        //booking address
        const { city, state, pincode, landmark, phone } = req.body

        //payment methods


    } catch (error) {
        console.log('Error in booking product', error)
        res.status(500).json({ message: 'Error in booking product', success: false })
    }
}

//show orders
export const showOrders = async (req, res) => {
    try {

        //finding logged user
        let user = ''
        try {
            user = findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false }) 
        }

        //check if user is normal user
        if(user.role !== 'user') return res.status(400).json({ message: 'Authentication failed', success: false })

        const orders = await Bookings.find({ buyer: user })
        if(orders.length === 0) return res.status(400).json({ message: 'No orders found', success: false })

        res.status(200).json({ message: orders, success: true })
    } catch (error) {
        console.log('error in showing user orders', error)
        res.status(500).json({ message: 'Error in showing user orders', success: false })
    }
}


//SELLER
//seller gets notification of new bookings with delivery details (Pending orders)
export const productDelivery = async (req, res) => {
    try {
        //find seller
        let user = ''
        try {
            user = findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }
        
        //check if user is seller
        if(user.role !== 'seller') return res.status(400).json({ message: 'Authentication failed', success: false })

        //fetch bookings which are pending
        const allOrders = await Bookings.find({ $and: [{ seller: user }, { status: 'Pending' }] })
        if(allOrders.length === 0 ) return res.json({ message: 'No pending orders', success: false })

        res.status(200).json({ message: allOrders, success: true })
    } catch (error) {
        console.log('error in seller product delivery', error)
        res.status(500).json({ message: 'Error in product delivery', success: false })
    }
}

//sellers view all orders that they have delivered and yet to be delivered
export const viewAllOrders = async (req, res) => {
    try {
        //find seller
        let user = ''
        try {
            user = findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }
        
        //check if user is seller
        if(user.role !== 'seller') return res.status(400).json({ message: 'Authentication failed', success: false })

        const allOrders = await Bookings.find({ seller: user })
        if(allOrders.length === 0 ) return res.json({ message: 'No orders to list', success: false })

        res.status(200).json({ message: allOrders, success: true })
    } catch (error) {
        console.log('error in seller viewing orders', error)
        res.status(500).json({ message: 'Error in viewing orders', success: false })
    }
}
import Bookings from "../models/bookingModel.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"
import razorpayInstance from "../config/razorpay/razorpayInstance.js"
import { createHmac, randomBytes } from 'node:crypto'
import dotenv from "dotenv";
import User from "../models/userModel.js"
import { findUser } from "../logic/basic-logic/findUser.js"

dotenv.config()

//buy from cart
// PAYMENT GATEWAY SET-UP 
export const createOrder = async (req, res) => {
    try {

        // total amount(in Rs) sent from FE 
        const { amount } = req.body


        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: randomBytes(16).toString('hex')
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log("Error in create order", error)
                return res.status(500).json({ message: "Something went wrong", success: false })
            }

            return res.status(200).json({ data: order })
        })

    } catch (error) {
        console.log("Error in create order function", error)
        res.status(500).json({ message: "Error in create order function", success: false })
    }
}

export const verify = async (req, res) => {
    try {

        // 'body' contains razorpay details
        // 'data' contains user entered address
        // 'cId' is Cart_Id
        const { body, data, cId } = req.body

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body

        const { addressDetail, state, city, landmark, pincode, phone } = data

        const generated_signature = createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed", success: false })
        }

        const findCart = await Cart.findOne({ _id: cId })    // finding cart

        const findProduct = await Product.findById(findCart.product)    //finding product

        const totalPrice = Number(findCart.quantity) * Number(findProduct.price)    //to find total price of the product

        const newBooking = new Bookings({
            buyer: findCart.buyer,
            product: findCart.product,
            quantity: findCart.quantity,
            seller: findProduct.seller,
            totalPrice,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            address: {
                city,
                state,
                pincode: Number(pincode),
                landmark,
                phone: Number(phone),
                addressDetail
            }
        })
        if (!newBooking) {
            return res.json({ message: "Booking failed", success: false })
        }

        const booking = await newBooking.save() //save to DB

        if (!booking) {
            return res.json({ message: "Booking failed", success: false })
        }

        //delete the cart after successful purchase of the product
        await Cart.findByIdAndDelete(cId)
        await Product.findByIdAndUpdate(findCart.product, { $inc: { stock: -1 }})

        return res.json({ message: "Booking successfull", success: true })
    } catch (error) {
        console.log("Error in booking verification", error)
        res.status(500).json({ message: "Error in booking verification", success: false })
    }
}
//end of booking



//show orders
export const showOrders = async (req, res) => {
    try {

        //finding logged user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            return res.json({ message: "Error in finding user", success: false })
        }

        //check if user is normal user
        if (user.role !== 'user') return res.json({ message: 'Authentication failed', success: false })

        const orders = await Bookings.find({ buyer: user })
        if (orders.length === 0) return res.json({ message: 'No orders found', success: false })

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const product = await Product.findById(order.product);
            const seller = await User.findById(order.seller);

            return {
                ...order.toObject(), // convert Mongoose document to plain JavaScript object
                product,
                seller
            };
        }));



        console.log(enrichedOrders)
        res.status(200).json({ message: enrichedOrders, success: true })
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
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.status(404).json({ message: "Error in finding user", success: false })
        }

        //check if user is seller
        if (user.role !== 'seller') return res.status(400).json({ message: 'Authentication failed', success: false })

        //fetch bookings which are pending
        const allOrders = await Bookings.find({ $and: [{ seller: user }, { status: 'Pending' }] })
        if (allOrders.length === 0) return res.json({ message: 'No pending orders', success: false })

        res.status(200).json({ message: allOrders, success: true })
    } catch (error) {
        console.log('error in seller product delivery', error)
        res.status(500).json({ message: 'Error in product delivery', success: false })
    }
}

//sellers view all orders that they have delivered and yet to be delivered
export const viewAllOrders = async (req, res) => {
    try {

        //finding logged user
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            return res.json({ message: "Error in finding user", success: false })
        }

        //check if user is normal user
        if (user.role !== 'seller') return res.json({ message: 'Authentication failed', success: false })

        const orders = await Bookings.find({ seller: user })
        if (orders.length === 0) return res.json({ message: 'No orders found', success: false })

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const product = await Product.findById(order.product);
            const buyer = await User.findById(order.buyer);

            return {
                ...order.toObject(), // convert Mongoose document to plain JavaScript object
                product,
                buyer
            };
        }));


        res.status(200).json({ message: enrichedOrders, success: true })
    } catch (error) {
        console.log('error in showing user orders', error)
        res.status(500).json({ message: 'Error in showing user orders', success: false })
    }
}


export const changeOrderStatus = async (req, res) => {
    try {
        //booking id
        const { id } = req.params

        const { status } = req.body

        const changeStatus = await Bookings.findOneAndUpdate(
            { _id: id },
            { status }
        )
        if (!changeStatus) return res.json({ message: 'Order was not changed, Failed', success: false })

        return res.status(200).json({ message: 'Order status have been changed', success: true })
    } catch (error) {
        console.log("Error in updating order status", error)
        res.status(500).json({ message: "Error in updating order status", success: false })
    }
}
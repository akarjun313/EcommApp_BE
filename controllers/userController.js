import User from "../models/userModel.js"
import dotenv from "dotenv"
import bcrypt from 'bcrypt'
import { userToken } from "../utils/token/generateToken.js"
import { findUser } from "../logic/basic-logic/findUser.js"
import Bookings from "../models/bookingModel.js"

dotenv.config()


// user & seller signup
export const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body

        // checking user exist 
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.json({ message: "user already exist", success: false })
        }

        // user checking with phone No. 
        const userExistPh = await User.findOne({ phone })
        if (userExistPh) {
            return res.json({ message: "Phone number already registered", success: false })
        }

        // checking role
        if (role !== 'user' && role !== 'seller') {
            return res.json({ message: "Invalid role", success: false })
        }


        // hashing password using bcrypt
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(password, saltRounds)

        // creating new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            hashPassword,
            role
        })
        if (!newUser) {
            return res.json({ message: 'error in user creation', success: false })
        }

        // saving new user
        const userToDb = await newUser.save()
        if (!userToDb) {
            return res.json({ message: 'error in saving new user', success: false })
        }

        res.json({ message: "Sign-up successful", success: true })
    } catch (error) {
        console.log("error in user sign-up ", error)
        return res.send("error in user sign-up")
    }
}


// user & seller Sign-In 
export const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body

        // checking user existance 
        const userExist = await User.findOne({ email })
        if (!userExist) {
            console.log("user not found")
            return res.json({ message: "user not found, please sign-up first", success: false })
        }

        // checking password
        const matchPassword = await bcrypt.compare(password, userExist.hashPassword)
        if (!matchPassword) {
            console.log("Incorrect password")
            return res.json({ message: "Incorrect password", success: false })
        }

        // generating token
        const userEmail = userExist.email
        const token = userToken(userExist)
        await res.cookie("token", token, {
            httpOnly: false,
            sameSite: 'None',
            secure: true,
        })

        // await res.cookie("userEmail", userEmail)
        await res.cookie('userEmail', encodeURIComponent(userEmail), { 
            httpOnly: false,
            sameSite: 'None',
            secure: true,
        })
        res.json({ message: ["Logged-In", userExist], success: true })
    } catch (error) {
        console.log("Error in user Sign-In", error)
        return res.send("Error in user Sign-In")
    }
}


// user sign-out
export const userLogout = async (req, res) => {
    try {
        await res.clearCookie("token")
        await res.clearCookie("userEmail")
        res.json({ message: "Logged Out", success: true })
    } catch (error) {
        console.log("Error in user sign-out", error)
        return res.json({ message: "Error in user sign-out", success: false })
    }
}


//find user and send to frontend
export const userCheck = async (req, res) => {
    try {
        let user = ''
        try {
            user = await findUser(req)
        } catch (error) {
            console.log("Error in finding user", error)
            res.json({ message: "Error in finding user", success: false })
        }

        res.json({ message: user, success: true })
    } catch (error) {
        console.log("error in userCheck", error)
        res.json({ message: "error in userCheck", success: false })
    }
}


// for protected routes in FE 
export const checkUser = async (req, res) => {
    try {

        const user = req.user
        console.log("checkUser function, User :", user)

        const findUser = await User.findOne({ _id: user.data })
        if (!findUser) {
            return res.json({ message: "authentication failed", success: false })
        }
        if (findUser.role != "user") {
            return res.json({ message: "authentication failed", success: false })
        }

        res.json({ message: "User authenticated", success: true })
    } catch (error) {
        console.log("Error in checkUser", error)
        res.status(500).json({ message: "Error in checkUser", success: false })
    }
}

export const checkSeller = async (req, res) => {
    try {
        const user = req.user

        const findUser = await User.findOne({ _id: user.data })
        if (!findUser) {
            return res.json({ message: "authentication failed", success: false })
        }
        if (findUser.role != "seller") {
            return res.json({ message: "authentication failed", success: false })
        }

        res.json({ message: "Seller authenticated", success: true })
    } catch (error) {
        console.log("Error in checkSeller", error)
        res.status(500).json({ message: "Error in checkSeller", success: false })
    }
}


//FOR ADMIN
//user and seller list for admin dashboard
export const userList = async (req, res) => {
    try {
        //count of seller & users
        const totalUsers = await User.countDocuments()
        const sellerCount = await User.countDocuments({ role: 'seller'})
        const userCount = await User.countDocuments({ role: 'user'})

        //count of bookings
        const bookingCount = await Bookings.countDocuments()


        res.status(200).json({totalUsers, sellerCount, userCount, bookingCount, success: true})
    } catch (error) {
        console.log('Error in fetching user and booking counts', error)
        res.status(500).json({message: 'Error in fetching user and booking counts', success: false})
    }
}
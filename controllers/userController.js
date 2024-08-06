import User from "../models/userModel.js"
import dotenv from "dotenv"
import bcrypt from 'bcrypt'
import { userToken } from "../utils/token/generateToken.js"

dotenv.config()


// user & seller signup
export const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body

        // checking user exist 
        const userExist = await User.findOne({ email })
        if(userExist){
            return res.json({ message: "user already exist", success: false })
        }

        // user checking with phone No. 
        const userExistPh = await User.findOne({ phone })
        if(userExistPh){
            return res.json({ message: "Phone number already registered", success: false })
        }

        // hashing password using bcrypt
        const saltRounds = process.env.SALT_ROUNDS
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
        if(!newUser){
            return res.json({ message: 'error in user creation', success: false })
        }

        // saving new user
        const userToDb = await newUser.save()
        if(!userToDb){
            return res.json({ message: 'error in saving new user', success: false })
        }

        res.json({message: "Sign-up successful", success: true})   
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
        if(!userExist){
            console.log("user not found")
            return res.json({ message : "user not found, please sign-up first", success : false })
        }

        // checking password
        const matchPassword = await bcrypt.compare(password, userExist.hashPassword)
        if(!matchPassword){
            console.log("Incorrect password")
            return res.json({ message: "Incorrect password", success: false })
        }

        // generating token
        const userEmail = userExist.email.toHexString()
        const token = userToken(userExist)
        await res.cookie("token", token)
        await res.cookie("userEmail", userEmail)

        res.json({ message: ["Logged-In"], success: true })
    } catch (error) {
        console.log("Error in user Sign-In", error)
        return res.send("Error in user Sign-In")
    }
}
import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { adminToken } from "../utils/token/generateToken.js"


// admin sign-In 
export const adminSignin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await User.findOne({ email })

        if (!userExist) {
            console.log("user not found")
            return res.json({ message: "user not found, please sign-up first", success: false })
        }

        if (userExist.role !== "admin") {
            console.log("user is not admin")
            return res.json({ message: "user is not admin", success: false })
        }

        const matchPassword = await bcrypt.compare(password, userExist.hashPassword)
        if (!matchPassword) {
            console.log("Incorrect password")
            return res.json({ message: "Incorrect password", success: false })
        }

        const token = adminToken(userExist)
        await res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: 'None'
        })

        res.json({ message: ["Logged-In", userExist], success: true })
    } catch (error) {
        console.log("Error in admin Sign-In", error)
        return res.send("Error in admin Sign-In")
    }
}


// admin sign-Out




export const checkAdmin = async (req, res) => {
    try {
        const user = req.user

        const findUser = await User.findOne({ _id: user.data })
        if (!findUser) {
            return res.json({ message: "authentication failed", success: false })
        }
        if (findUser.role != "admin") {
            return res.json({ message: "authentication failed", success: false })
        }

        res.json({ message: "Admin authenticated", success: true })
    } catch (error) {
        console.log("Error in checkAdmin", error)
        res.status(500).json({ message: "Error in checkAdmin", success: false })
    }
}


export const logoutAdmin = async (req, res) => {
    try {
        await res.clearCookie("token")
        res.json({ message: "Logged Out", success: true })
    } catch (error) {
        console.log("Error in admin sign-out", error)
        return res.json({ message: "Error in admin sign-out", success: false })
    }
}
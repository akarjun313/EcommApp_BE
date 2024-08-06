import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { adminToken } from "../utils/token/generateToken.js"


// admin sign-In 
export const adminSignin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await User.findOne({ email })

        if(!userExist){
            console.log("user not found")
            return res.json({ message : "user not found, please sign-up first", success : false })
        }

        if(userExist.role !== "admin"){
            console.log("user is not admin")
            return res.json({ message: "user is not admin", success: false })
        }

        const matchPassword = await bcrypt.compare(password, userExist.hashPassword)
        if(!matchPassword){
            console.log("Incorrect password")
            return res.json({ message: "Incorrect password", success: false })
        }

        const token = adminToken(userExist)
        await res.cookie("token", token)

        res.json({ message: ["Logged-In"], success: true })
    } catch (error) {
        console.log("Error in admin Sign-In", error)
        return res.send("Error in admin Sign-In")
    }
}


// admin sign-Out
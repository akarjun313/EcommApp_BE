import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

async function authenticateUser(req, res, next){
    const token = await req.cookies.token

    jwt.verify(token, process.env.SE, (err, user)=>{
        
        if(err){
            console.log(err)
            res.clearCookie("token")
            res.clearCookie("userEmail")
            return res.status(400).json({ message: "error in user authentification", success: false })
        } 
        
        req.user = user

        if(req.user.role !== "user") return res.status(400).json({ message: "User authentication failed", success: false })

        next()
    })
}

export default authenticateUser
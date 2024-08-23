import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

async function authenticateSeller(req, res, next){
    const token = await req.cookies.token

    jwt.verify(token, process.env.SE, (err, user)=>{
    
        if(err){
            console.log(err)
            res.clearCookie("token")
            res.clearCookie("userEmail")
            return res.status(400).json({ message: "error in seller authentification", success: false })
        } 
        
        req.user = user 
        
        if(req.user.role !== "seller") return res.status(400).json({ message: "Seller authentification failed", success: false })

        next()
    })
}

export default authenticateSeller
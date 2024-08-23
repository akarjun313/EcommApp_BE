import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

async function authenticateAdmin(req, res, next){
    const token = await req.cookies.token

    jwt.verify(token, process.env.SE, (err, user)=>{
        

        if(err){
            console.log(err)
            res.clearCookie("token")
            return res.status(400).send(err)
        } 

        req.user = user

        if(req.user.role !== "admin") return res.status(400).json({ message: "admin authentication failed", success: false })

        next()
    })
}

export default authenticateAdmin
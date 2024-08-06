import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const userToken = (userExist) => {
    return jwt.sign({ data : userExist.id, role : userExist.role }, process.env.SE, { expiresIn : '1d' })
}


export const adminToken = (adminExist) => {
    return jwt.sign({ data : adminExist.id, role : adminExist.role }, process.env.SE, { expiresIn : '2h' })
}
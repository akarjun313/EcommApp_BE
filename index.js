import express from 'express'
import { connectDb } from "./config/db/db.js"
import cookieParser from 'cookie-parser'
import adminRouter from './routes/admin/adminRoutes.js'
import userRouter from './routes/user/userRoutes.js'
import sellerRouter from './routes/seller/sellerRoutes.js'
import cors from 'cors'

const app = express()
const port = 5213

let corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    optionsSuccessStatus: 200,
    credentials : true
}


// middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/seller', sellerRouter)

// db connection 
connectDb()

app.get('/', (req, res)=>{
    res.send('welcome to My-Ecomm')
})

app.listen(port, ()=>{
    console.log(`app listening to port ${port}`)
})

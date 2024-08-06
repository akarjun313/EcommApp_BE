import express from 'express'
import { connectDb } from "./config/db/db.js"
import cookieParser from 'cookie-parser'

const app = express()
const port = 5213

// middlewares
app.use(express.json())
app.use(cookieParser())

// db connection 
connectDb()

app.get('/', (req, res)=>{
    res.send('welcome to My-Ecomm')
})

app.listen(port, ()=>{
    console.log(`app listening to port ${port}`)
})

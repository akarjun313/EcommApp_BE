import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName : {
        required : true,
        type : String,
        minLength : 3,
        maxLength : 20
    },
    lastName : {
        required : true,
        type : String,
        minLength : 1,
        maxLength : 20
    },
    email : {
        required : true,
        type : String,
        minLength : 5,
        unique : true
    },
    phone : {
        type : Number,
        min : 10,
        unique : true
    },
    hashPassword : {
        type : String,
        required : true,
        minLength : 6
    },
    role : {
        type : String,
        required : true,
        enum : ["admin", "seller", "user"]
    }
},{ timestamps : true })


const User = mongoose.model('user', userSchema)
export default User
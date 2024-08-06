import User from "../../models/userModel.js"

//function to find user
export const findUser = async () => {
    try {

        //Fetching user email from cookies
        const email = await req.cookies.userEmail

        //finding user
        const findUser = await User.findOne({ email })
        if(!findUser){
            console.log("user not found")
            return false
        }
        return findUser
    } catch (error) {
        console.log("error in Find user logic", error)
        return false
    }
}
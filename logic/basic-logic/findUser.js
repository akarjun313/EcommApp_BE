import User from "../../models/userModel.js"

//function to find user
export const findUser = async (req) => {
    try {

        //Fetching user email from cookies
        const email = decodeURIComponent(req.cookies.userEmail)

        //finding user
        const findUser = await User.findOne({ email })
        if(!findUser){
            throw new Error('User not found')
        }
        return findUser
    } catch (error) {
        console.log("error in Find user logic", error)
        throw error
    }
}
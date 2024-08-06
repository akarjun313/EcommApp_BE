
//buy from cart
export const bookProduct = async (req, res) => {
    try {
        //code
    } catch (error) {
        console.log('Error in booking product', error)
        res.status(500).json({ message: 'Error in booking product', success: false })
    }
}
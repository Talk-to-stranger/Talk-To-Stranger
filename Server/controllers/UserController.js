const { User } = require('../models')
class UserController {

    static async register (req, res) {
        try {
            const {email, password, name, phoneNumber}  = req.body
            const user = await User.create({email, password, name, phoneNumber})
            res.status(201).json({
                id: user.id,
                email: user.email
            })
        } catch (error) {
            res.status(500).json({message: "internal server error"})
        }
    }


}

module.exports = UserController;
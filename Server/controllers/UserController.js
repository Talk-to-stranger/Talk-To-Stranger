const { User } = require('../models')
class UserController {

    static async register(req, res) {
        try {
            const { email, password, name, phoneNumber } = req.body
            const user = await User.create({ email, password, name, phoneNumber })
            res.status(201).json({
                id: user.id,
                email: user.email
            })
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }
    }

    static async login(req, res) {
        try {
            const { email, password} = req.body
            const user = await User.create({ email, password, name, phoneNumber })
            res.status(201).json({
                id: user.id,
                email: user.email
            })
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
        }
    }

    static async loginUserSocket(socketId, data) {
        try {

            const user = await User.findByPk(data.userId)
            if (!user) throw ({ message: "User not Found" })
            

            await user.update({SocketId: socketId})
            
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = UserController;
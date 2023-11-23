const { comparePassword } = require('../helpers/bcrypt');
const { signToken, verifyToken } = require('../helpers/jwt');
const { User } = require('../models');
class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, name, phoneNumber } = req.body;
      const user = await User.create({ email, password, name, phoneNumber });
      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: 'NullEmail' };
      if (!password) throw { name: 'NullPassword' };
      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: 'ErrorEmailorPassword' };
      const isTruePassword = comparePassword(password, user.password);
      if (!isTruePassword) throw { name: 'ErrorEmailorPassword' };
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async test(req, res, next) {
    try {
      // const user = await User.findAll();
    } catch (error) {
      next(error);
    }
  }

  static async loginUserSocket(socketId, data) {
    try {
      const { id } = verifyToken(data.access_token);

      const user = await User.findOne({
        where: {
          id,
        },
        attributes: ['id', 'name', 'status', 'SocketId'],
      });
      if (!user) throw { message: 'User not Found' };

      await user.update({ SocketId: socketId, status: 'online' });

      const users = await User.findAll({
        attributes: ['id', 'name', 'status', 'SocketId'],
      });
      return { users, myProfile: user.name };
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserBySocketId(data) {
    try {
      const user = await User.findOne({ where: { SocketId: data } });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  static async disconnectUser(data) {
    try {
      const { id } = verifyToken(data.access_token);
      const user = await User.findByPk(id)
      return user
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;

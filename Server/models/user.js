'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name is required',
          },
          notNull: {
            msg: 'Name is required',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Email is required',
          },
          notNull: {
            msg: 'Email is required',
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'PhoneNumber is required',
          },
          notNull: {
            msg: 'PhoneNumber is required',
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'offline',
      },
      SocketId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};

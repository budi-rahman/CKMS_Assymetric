'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserData.init({
    name: DataTypes.STRING,
    phone: DataTypes.TEXT,
    nik: DataTypes.TEXT,
    email: DataTypes.TEXT,
    dateofbirth: DataTypes.TEXT,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserData',
  });
  return UserData;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KeyStorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  KeyStorage.init({
    publickey: DataTypes.TEXT,
    privatekey: DataTypes.TEXT,
    label: DataTypes.STRING,
    keyHandle: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'KeyStorage',
  });
  return KeyStorage;
};
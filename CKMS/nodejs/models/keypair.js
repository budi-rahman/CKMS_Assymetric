'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keypair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Keypair.init({
    label: {
      type: DataTypes.STRING
    },
    modlus: DataTypes.TEXT,
    public: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Keypair',
  });
  return Keypair;
};
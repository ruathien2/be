'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.allcodes, {foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData'})
      user.belongsTo(models.allcodes, {foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData'})
      user.hasOne(models.markdown, {foreignKey: 'doctorId'})
      user.hasOne(models.Doctor_infor, {foreignKey: 'doctorId'})

      // user.hasMany(models.Schedule, {targetKey: 'doctorId', as: 'doctorData'})
      //  user.hasMany(models.bookings, {targetKey: 'doctorId', as: 'patientData'})
    }
  };
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
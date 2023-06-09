'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class allcodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      allcodes.hasMany(models.user, {foreignKey: 'positionId', as: 'positionData'})
      allcodes.hasMany(models.user, {foreignKey: 'gender', as:'genderData'})
      allcodes.hasMany(models.Schedule, {foreignKey: 'timeType', as:'timeTypeData'})
      
      allcodes.hasMany(models.Doctor_infor, {foreignKey: 'priceId', as:'priceIdTypeData'})
      allcodes.hasMany(models.Doctor_infor, {foreignKey: 'paymentId', as:'paymentIdTypeData'})
      allcodes.hasMany(models.Doctor_infor, {foreignKey: 'provinceId', as:'provinceIdTypeData'})

      allcodes.hasMany(models.bookings, {foreignKey: 'timeType', as:'timeTypeDataPatient'})
    }
  };
  allcodes.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'allcodes',
  });
  return allcodes;
};
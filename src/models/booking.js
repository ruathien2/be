'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bookings.belongsTo(models.allcodes, {foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient'})
      // define association here
      bookings.belongsTo(models.user, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientData",
      });
    }
  };
  bookings.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};
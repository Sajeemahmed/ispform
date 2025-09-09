const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Customer = require('./Customer');

const InstallationAddress = sequelize.define('InstallationAddress', {
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customer_id'
    }
  },
  house_flat_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  street_locality: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pin_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  landmark: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gps_lat: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  gps_long: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  }
}, {
  tableName: 'installation_address',
  timestamps: false
});

module.exports = InstallationAddress;
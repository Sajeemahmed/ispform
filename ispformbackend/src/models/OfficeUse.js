const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Customer = require('./Customer');

const OfficeUse = sequelize.define('OfficeUse', {
  office_id: {
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
  caf_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  plan_activated_on: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  mac_onu_serial_no: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  olt_port_vlan_assigned: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  handled_by: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'office_use',
  timestamps: false
});

module.exports = OfficeUse;
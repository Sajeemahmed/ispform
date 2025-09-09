const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Customer = require('./Customer');

const Declaration = sequelize.define('Declaration', {
  declaration_id: {
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
  declaration_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  signature: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  declaration_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'declaration',
  timestamps: false
});

module.exports = Declaration;
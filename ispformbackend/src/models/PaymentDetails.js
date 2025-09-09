const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Customer = require('./Customer');

const PaymentDetails = sequelize.define('PaymentDetails', {
  payment_id: {
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
  security_deposit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  installation_charges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  first_month_rental: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total_amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_mode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['CASH', 'UPI', 'BANK_TRANSFER', 'CARD']]
    }
  },
  transaction_receipt_no: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payment_details',
  timestamps: false
});

module.exports = PaymentDetails;
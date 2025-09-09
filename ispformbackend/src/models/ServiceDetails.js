const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Customer = require('./Customer');

const ServiceDetails = sequelize.define('ServiceDetails', {
  service_id: {
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
  internet_plan: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  speed_data_limit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  billing_cycle: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['MONTHLY', 'QUARTERLY', 'YEARLY']]
    }
  },
  installation_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  static_ip_required: {
    type: DataTypes.STRING(3),
    defaultValue: 'NO',
    validate: {
      isIn: [['YES', 'NO']]
    }
  },
  additional_services: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'service_details',
  timestamps: false
});

module.exports = ServiceDetails;
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unique_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  father_spouse_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['MALE', 'FEMALE', 'OTHER']]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  mobile_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  alternate_number: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  id_proof_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['AADHAAR', 'VOTER_ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER']]
    }
  },
  id_proof_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  id_proof_copy_attached: {
    type: DataTypes.STRING(3),
    defaultValue: 'NO',
    validate: {
      isIn: [['YES', 'NO']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'customer',
  timestamps: false
});

module.exports = Customer;
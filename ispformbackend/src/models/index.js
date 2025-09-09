const Customer = require('./Customer');
const InstallationAddress = require('./InstallationAddress');
const ServiceDetails = require('./ServiceDetails');
const PaymentDetails = require('./PaymentDetails');
const Declaration = require('./Declaration');
const OfficeUse = require('./OfficeUse');

// Define associations
Customer.hasOne(InstallationAddress, {
  foreignKey: 'customer_id',
  as: 'address'
});

Customer.hasOne(ServiceDetails, {
  foreignKey: 'customer_id',
  as: 'service'
});

Customer.hasOne(PaymentDetails, {
  foreignKey: 'customer_id',
  as: 'payment'
});

Customer.hasOne(Declaration, {
  foreignKey: 'customer_id',
  as: 'declaration'
});

Customer.hasOne(OfficeUse, {
  foreignKey: 'customer_id',
  as: 'office'
});

// Reverse associations
InstallationAddress.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

ServiceDetails.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

PaymentDetails.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

Declaration.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

OfficeUse.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

module.exports = {
  Customer,
  InstallationAddress,
  ServiceDetails,
  PaymentDetails,
  Declaration,
  OfficeUse
};
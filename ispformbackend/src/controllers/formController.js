const { v4: uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const sequelize = require('../../config/database');
const {
  Customer,
  InstallationAddress,
  ServiceDetails,
  PaymentDetails,
  Declaration,
  OfficeUse
} = require('../models');

const createForm = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      customerDetails,
      installationAddress,
      serviceDetails,
      paymentDetails,
      declaration,
      officeUse
    } = req.body;

    // Check for duplicate email or mobile number
    const existingCustomer = await Customer.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: customerDetails.email },
          { mobile_number: customerDetails.mobileNumber }
        ]
      }
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: 'A customer with this email or mobile number already exists',
        code: 'DUPLICATE_ENTRY',
        duplicateField: existingCustomer.email === customerDetails.email ? 'email' : 'mobile'
      });
    }

    // Generate unique ID
    const uniqueId = uuidv4();

    // Create customer
    const customer = await Customer.create({
      unique_id: uniqueId,
      full_name: customerDetails.fullName,
      father_spouse_name: customerDetails.fatherSpouseName,
      dob: customerDetails.dob,
      gender: customerDetails.gender.toUpperCase(),
      email: customerDetails.email,
      mobile_number: customerDetails.mobileNumber,
      alternate_number: customerDetails.alternateNumber,
      id_proof_type: customerDetails.idProofType.toUpperCase(),
      id_proof_number: customerDetails.idProofNumber,
      id_proof_copy_attached: customerDetails.idProofCopyAttached.toUpperCase()
    }, { transaction });

    // Create installation address
    if (installationAddress) {
      await InstallationAddress.create({
        customer_id: customer.customer_id,
        house_flat_no: installationAddress.houseFlatNo,
        street_locality: installationAddress.streetLocality,
        city: installationAddress.city,
        district: installationAddress.district,
        state: installationAddress.state,
        pin_code: installationAddress.pinCode,
        landmark: installationAddress.landmark,
        gps_lat: installationAddress.gpsLat,
        gps_long: installationAddress.gpsLong
      }, { transaction });
    }

    // Create service details
    if (serviceDetails) {
      await ServiceDetails.create({
        customer_id: customer.customer_id,
        internet_plan: serviceDetails.internetPlan,
        speed_data_limit: serviceDetails.speedDataLimit,
        billing_cycle: serviceDetails.billingCycle?.toUpperCase(),
        installation_date: serviceDetails.installationDate,
        static_ip_required: serviceDetails.staticIpRequired?.toUpperCase(),
        additional_services: serviceDetails.additionalServices
      }, { transaction });
    }

    // Create payment details
    if (paymentDetails) {
      await PaymentDetails.create({
        customer_id: customer.customer_id,
        security_deposit: parseFloat(paymentDetails.securityDeposit) || 0,
        installation_charges: parseFloat(paymentDetails.installationCharges) || 0,
        first_month_rental: parseFloat(paymentDetails.firstMonthRental) || 0,
        total_amount_paid: parseFloat(paymentDetails.totalAmountPaid),
        payment_mode: paymentDetails.paymentMode?.toUpperCase(),
        transaction_receipt_no: paymentDetails.transactionReceiptNo
      }, { transaction });
    }

    // Create declaration
    if (declaration) {
      await Declaration.create({
        customer_id: customer.customer_id,
        declaration_text: declaration.declarationText,
        signature: declaration.signature,
        declaration_date: declaration.declarationDate
      }, { transaction });
    }

    // Create office use (if provided)
    if (officeUse && officeUse.cafNo) {
      await OfficeUse.create({
        customer_id: customer.customer_id,
        caf_no: officeUse.cafNo,
        plan_activated_on: officeUse.planActivatedOn,
        mac_onu_serial_no: officeUse.macOnuSerialNo,
        olt_port_vlan_assigned: officeUse.oltPortVlanAssigned,
        handled_by: officeUse.handledBy
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      uniqueId: uniqueId,
      frontendUrl: `http://localhost:5173/${uniqueId}`,
      apiUrl: `http://localhost:5000/api/forms/${uniqueId}`
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating form:', error);

    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateField = error.errors[0]?.path || 'unknown';
      return res.status(409).json({
        success: false,
        message: `Duplicate entry detected for ${duplicateField}`,
        code: 'DUPLICATE_ENTRY',
        duplicateField: duplicateField
      });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getForm = async (req, res) => {
  try {
    const { uniqueId } = req.params;  

    const customer = await Customer.findOne({
      where: { unique_id: uniqueId },
      include: [
        { model: InstallationAddress, as: 'address' },
        { model: ServiceDetails, as: 'service' },
        { model: PaymentDetails, as: 'payment' },
        { model: Declaration, as: 'declaration' },
        { model: OfficeUse, as: 'office' }
      ]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
        code: 'FORM_NOT_FOUND'
      });
    }

    // Format response
    const formData = {
      uniqueId: customer.unique_id,
      customerDetails: {
        fullName: customer.full_name,
        fatherSpouseName: customer.father_spouse_name,
        dob: customer.dob,
        gender: customer.gender,
        email: customer.email,
        mobileNumber: customer.mobile_number,
        alternateNumber: customer.alternate_number,
        idProofType: customer.id_proof_type,
        idProofNumber: customer.id_proof_number,
        idProofCopyAttached: customer.id_proof_copy_attached
      },
      installationAddress: customer.address ? {
        houseFlatNo: customer.address.house_flat_no,
        streetLocality: customer.address.street_locality,
        city: customer.address.city,
        district: customer.address.district,
        state: customer.address.state,
        pinCode: customer.address.pin_code,
        landmark: customer.address.landmark,
        gpsLat: customer.address.gps_lat,
        gpsLong: customer.address.gps_long
      } : null,
      serviceDetails: customer.service ? {
        internetPlan: customer.service.internet_plan,
        speedDataLimit: customer.service.speed_data_limit,
        billingCycle: customer.service.billing_cycle,
        installationDate: customer.service.installation_date,
        staticIpRequired: customer.service.static_ip_required,
        additionalServices: customer.service.additional_services
      } : null,
      paymentDetails: customer.payment ? {
        securityDeposit: customer.payment.security_deposit,
        installationCharges: customer.payment.installation_charges,
        firstMonthRental: customer.payment.first_month_rental,
        totalAmountPaid: customer.payment.total_amount_paid,
        paymentMode: customer.payment.payment_mode,
        transactionReceiptNo: customer.payment.transaction_receipt_no,
        paymentDate: customer.payment.payment_date
      } : null,
      declaration: customer.declaration ? {
        declarationText: customer.declaration.declaration_text,
        signature: customer.declaration.signature,
        declarationDate: customer.declaration.declaration_date
      } : null,
      officeUse: customer.office ? {
        cafNo: customer.office.caf_no,
        planActivatedOn: customer.office.plan_activated_on,
        macOnuSerialNo: customer.office.mac_onu_serial_no,
        oltPortVlanAssigned: customer.office.olt_port_vlan_assigned,
        handledBy: customer.office.handled_by
      } : null,
      createdAt: customer.created_at
    };

    res.json({
      success: true,
      data: formData
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
module.exports = {
  createForm,
  getForm

};
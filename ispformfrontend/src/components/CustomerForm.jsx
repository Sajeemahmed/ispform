// CustomerForm.jsx - Complete file
import React, { useState, useEffect } from 'react';
import SignatureCanvas from './SignatureCanvas';
import logo from '../assets/wavesnet.png';
// Constants defined inline to avoid import issues
const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

const ID_PROOF_OPTIONS = [
  { value: 'AADHAAR', label: 'Aadhaar' },
  { value: 'VOTER_ID', label: 'Voter ID' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
  { value: 'OTHER', label: 'Other' }
];

const YES_NO_OPTIONS = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' }
];

const BILLING_CYCLE_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' }
];

const PAYMENT_MODE_OPTIONS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CARD', label: 'Card' }
];

const STATES_IN_INDIA = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const INTERNET_PLANS = [
  '25 Mbps - ₹499/month',
  '50 Mbps - ₹699/month',
  '100 Mbps - ₹999/month',
  '200 Mbps - ₹1499/month',
  '300 Mbps - ₹1999/month',
  '500 Mbps - ₹2999/month'
];
const DEFAULT_DECLARATION_TEXT =
  "I, [CUSTOMER_NAME], hereby declare that the above information is true to the best of my knowledge. I have read and understood the Terms & Conditions of service and agree to abide by them.";


const CustomerForm = ({ onFormSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Customer Details
    fullName: '',
    fatherSpouseName: '',
    dob: '',
    gender: '',
    email: '',
    mobileNumber: '',
    alternateNumber: '',
    idProofType: '',
    idProofNumber: '',
    idProofCopyAttached: 'NO',
    
    // Installation Address
    houseFlatNo: '',
    streetLocality: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    landmark: '',
    gpsLat: '',
    gpsLong: '',
    
    // Service Details
    internetPlan: '',
    speedDataLimit: '',
    billingCycle: '',
    installationDate: '',
    staticIpRequired: 'NO',
    additionalServices: '',
    
    // Payment Details
    securityDeposit: '',
    installationCharges: '',
    firstMonthRental: '',
    totalAmountPaid: '',
    paymentMode: '',
    transactionReceiptNo: '',
    
    // Declaration
    declarationText: DEFAULT_DECLARATION_TEXT,
    signature: '',
    declarationDate: new Date().toISOString().split('T')[0],
    
    // Office Use
    cafNo: '',
    planActivatedOn: '',
    macOnuSerialNo: '',
    oltPortVlanAssigned: '',
    handledBy: ''
  });
 // Auto-calculate total payment amount
  useEffect(() => {
    const securityDeposit = parseFloat(formData.securityDeposit) || 0;
    const installationCharges = parseFloat(formData.installationCharges) || 0;
    const firstMonthRental = parseFloat(formData.firstMonthRental) || 0;
    
    const total = securityDeposit + installationCharges + firstMonthRental;
    
    setFormData(prev => ({
      ...prev,
      totalAmountPaid: total.toFixed(2)
    }));
  }, [formData.securityDeposit, formData.installationCharges, formData.firstMonthRental]);

  // Auto-update declaration text with customer name
  useEffect(() => {
    if (formData.fullName) {
      setFormData(prev => ({
        ...prev,
        declarationText: DEFAULT_DECLARATION_TEXT.replace('[CUSTOMER_NAME]', formData.fullName)
      }));
    }
  }, [formData.fullName]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignatureChange = (signatureDataURL) => {
    setFormData(prev => ({
      ...prev,
      signature: signatureDataURL
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'fullName', 'dob', 'gender', 'email', 'mobileNumber',
      'idProofType', 'idProofNumber', 'internetPlan', 'billingCycle',
      'totalAmountPaid', 'paymentMode', 'signature'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const submitData = {
      uniqueId: 'FORM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      customerDetails: {
        fullName: formData.fullName,
        fatherSpouseName: formData.fatherSpouseName,
        dob: formData.dob,
        gender: formData.gender,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        alternateNumber: formData.alternateNumber,
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber,
        idProofCopyAttached: formData.idProofCopyAttached
      },
      installationAddress: {
        houseFlatNo: formData.houseFlatNo,
        streetLocality: formData.streetLocality,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pinCode: formData.pinCode,
        landmark: formData.landmark,
        gpsLat: formData.gpsLat || null,
        gpsLong: formData.gpsLong || null
      },
      serviceDetails: {
        internetPlan: formData.internetPlan,
        speedDataLimit: formData.speedDataLimit,
        billingCycle: formData.billingCycle,
        installationDate: formData.installationDate || null,
        staticIpRequired: formData.staticIpRequired,
        additionalServices: formData.additionalServices
      },
      paymentDetails: {
        securityDeposit: formData.securityDeposit,
        installationCharges: formData.installationCharges,
        firstMonthRental: formData.firstMonthRental,
        totalAmountPaid: formData.totalAmountPaid,
        paymentMode: formData.paymentMode,
        transactionReceiptNo: formData.transactionReceiptNo
      },
      declaration: {
        declarationText: formData.declarationText,
        signature: formData.signature,
        declarationDate: formData.declarationDate
      },
      officeUse: formData.cafNo ? {
        cafNo: formData.cafNo,
        planActivatedOn: formData.planActivatedOn || null,
        macOnuSerialNo: formData.macOnuSerialNo,
        oltPortVlanAssigned: formData.oltPortVlanAssigned,
        handledBy: formData.handledBy
      } : null
    };

    // Use your existing API
    const { formAPI } = await import('../services/api');
    const response = await formAPI.submitForm(submitData);
    
    if (response.data.success) {
      alert(`Form submitted successfully!\n\nUnique ID: ${response.data.uniqueId}`);
      
      // Pass the uniqueId from the API response to parent component
      if (onFormSubmit) {
        onFormSubmit({ uniqueId: response.data.uniqueId });
      }
      
      console.log('Form submitted successfully:', response.data);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Error submitting form: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="form-container">
     <div className="form-header">
  <div className="header-content">
    <img 
      src={logo} 
      alt="WavesNett Logo" 
      className="company-logo"
    />
    <div className="header-text">
      <h1>CUSTOMER APPLICATION FORM – INTERNET CONNECTION</h1>
      <div className="company-info">
        <p><strong>WavesNett Technologies Inc.</strong></p>
        <p>Zars Mansion Near Water Tank, Yadulla Colony, Gulbarga – 585104</p>
        <p>Email: info@wavesnett.com | Phone: +91-XXXXXXXXXX</p>
      </div>
    </div>
  </div>
</div>

      <form onSubmit={handleSubmit}>
        {/* Customer Details */}
        <section className="form-section">
          <h2>1. Customer Details</h2>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label-cell">Full Name <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Father's / Spouse's Name</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="fatherSpouseName"
                    value={formData.fatherSpouseName}
                    onChange={handleInputChange}
                    placeholder="Enter father's or spouse's name"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Date of Birth <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Gender <span className="required">*</span></td>
                <td className="input-cell checkbox-cell">
                  {GENDER_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Email ID <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Mobile Number <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    pattern="[6-9]\d{9}"
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Alternate Number</td>
                <td className="input-cell">
                  <input
                    type="tel"
                    name="alternateNumber"
                    value={formData.alternateNumber}
                    onChange={handleInputChange}
                    pattern="[6-9]\d{9}"
                    maxLength="10"
                    placeholder="Enter 10-digit alternate number"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">ID Proof Type <span className="required">*</span></td>
                <td className="input-cell checkbox-cell">
                  {ID_PROOF_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="idProofType"
                        value={option.value}
                        checked={formData.idProofType === option.value}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">ID Proof Number <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="idProofNumber"
                    value={formData.idProofNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter ID proof number"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">ID Proof Copy Attached</td>
                <td className="input-cell checkbox-cell">
                  {YES_NO_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="idProofCopyAttached"
                        value={option.value}
                        checked={formData.idProofCopyAttached === option.value}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Installation Address */}
        <section className="form-section">
          <h2>2. Installation Address</h2>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label-cell">House / Flat No.</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="houseFlatNo"
                    value={formData.houseFlatNo}
                    onChange={handleInputChange}
                    placeholder="Enter house/flat number"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Street / Locality</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="streetLocality"
                    value={formData.streetLocality}
                    onChange={handleInputChange}
                    placeholder="Enter street/locality"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">City / Town</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city/town"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">District</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Enter district"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">State</td>
                <td className="input-cell">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="">Select State</option>
                    {STATES_IN_INDIA.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="label-cell">PIN Code</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    pattern="\d{6}"
                    maxLength="6"
                    placeholder="6-digit PIN code"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Landmark</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter nearby landmark"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">GPS Coordinates</td>
                <td className="input-cell">
                  <div className="gps-container">
                    <span>Lat: </span>
                    <input
                      type="number"
                      name="gpsLat"
                      value={formData.gpsLat}
                      onChange={handleInputChange}
                      step="0.000001"
                      className="gps-input"
                      placeholder="0.000000"
                    />
                    <span> Long: </span>
                    <input
                      type="number"
                      name="gpsLong"
                      value={formData.gpsLong}
                      onChange={handleInputChange}
                      step="0.000001"
                      className="gps-input"
                      placeholder="0.000000"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Service Details */}
        <section className="form-section">
          <h2>3. Service Details</h2>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label-cell">Internet Plan <span className="required">*</span></td>
                <td className="input-cell">
                  <select
                    name="internetPlan"
                    value={formData.internetPlan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Plan</option>
                    {INTERNET_PLANS.map(plan => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="label-cell">Speed / Data Limit</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="speedDataLimit"
                    value={formData.speedDataLimit}
                    onChange={handleInputChange}
                    placeholder="e.g., 100 Mbps Unlimited"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Billing Cycle <span className="required">*</span></td>
                <td className="input-cell checkbox-cell">
                  {BILLING_CYCLE_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="billingCycle"
                        value={option.value}
                        checked={formData.billingCycle === option.value}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Installation Date (Preferred)</td>
                <td className="input-cell">
                  <input
                    type="date"
                    name="installationDate"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Static IP Required</td>
                <td className="input-cell checkbox-cell">
                  {YES_NO_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="staticIpRequired"
                        value={option.value}
                        checked={formData.staticIpRequired === option.value}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Additional Services</td>
                <td className="input-cell">
                  <textarea
                    name="additionalServices"
                    value={formData.additionalServices}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Any additional services required"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Payment Details */}
        <section className="form-section">
          <h2>4. Payment Details</h2>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label-cell">Security Deposit</td>
                <td className="input-cell">
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Installation Charges</td>
                <td className="input-cell">
                  <input
                    type="number"
                    name="installationCharges"
                    value={formData.installationCharges}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">First Month Rental</td>
                <td className="input-cell">
                  <input
                    type="number"
                    name="firstMonthRental"
                    value={formData.firstMonthRental}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Total Amount Paid <span className="required">*</span></td>
                <td className="input-cell">
                  <input
                    type="number"
                    name="totalAmountPaid"
                    value={formData.totalAmountPaid}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Payment Mode <span className="required">*</span></td>
                <td className="input-cell checkbox-cell">
                  {PAYMENT_MODE_OPTIONS.map(option => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="radio"
                        name="paymentMode"
                        value={option.value}
                        checked={formData.paymentMode === option.value}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkbox-text">{option.label}</span>
                    </label>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Transaction / Receipt No.</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="transactionReceiptNo"
                    value={formData.transactionReceiptNo}
                    onChange={handleInputChange}
                    placeholder="Transaction or receipt number"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Declaration */}
        <section className="form-section">
          <h2>5. Declaration</h2>
          <div className="declaration-content">
            <textarea
              name="declarationText"
              value={formData.declarationText}
              onChange={handleInputChange}
              rows="4"
              className="declaration-text"
            />
            <div className="signature-section">
              <div className="signature-label">
                Customer Signature: <span className="required">*</span>
              </div>
              <SignatureCanvas
                onSignatureChange={handleSignatureChange}
                signatureData={formData.signature}
              />
              <div className="signature-date">
                <label>Date: </label>
                <input
                  type="date"
                  name="declarationDate"
                  value={formData.declarationDate}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* For Office Use Only */}
        <section className="form-section office-section">
          <h2>For Office Use Only</h2>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="label-cell">CAF No.</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="cafNo"
                    value={formData.cafNo}
                    onChange={handleInputChange}
                    placeholder="Customer Application Form Number"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Plan Activated On</td>
                <td className="input-cell">
                  <input
                    type="date"
                    name="planActivatedOn"
                    value={formData.planActivatedOn}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">MAC / ONU Serial No.</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="macOnuSerialNo"
                    value={formData.macOnuSerialNo}
                    onChange={handleInputChange}
                    placeholder="MAC or ONU serial number"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">OLT Port / VLAN Assigned</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="oltPortVlanAssigned"
                    value={formData.oltPortVlanAssigned}
                    onChange={handleInputChange}
                    placeholder="OLT port and VLAN details"
                  />
                </td>
              </tr>
              <tr>
                <td className="label-cell">Handled By (Staff Name)</td>
                <td className="input-cell">
                  <input
                    type="text"
                    name="handledBy"
                    value={formData.handledBy}
                    onChange={handleInputChange}
                    placeholder="Staff member name"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
// FormView.jsx - Fixed component with proper imports
import React, { useRef } from "react"; // Added useRef import
import SignatureCanvas from "./SignatureCanvas";
import logo from "../assets/wavesnet.png";
import html2pdf from "html2pdf.js";

const FormView = ({ formData, onBackToForm }) => {
  const formRef = useRef(); // Now properly imported

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = formRef.current;

    const options = {
      margin: 10,
      filename: "CustomerForm.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(element).save();
  };

  if (!formData) {
    return (
      <div className="error-container">
        <h2>No Form Data</h2>
        <p>No form data available to display.</p>
        <button onClick={onBackToForm} className="back-button">
          ← Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="form-view-container" ref={formRef}>
      <div className="form-header">
        <div className="header-content">
          <img src={logo} alt="WavesNett Logo" className="company-logo" />

          <div className="header-text">
            <h1>CUSTOMER APPLICATION FORM – INTERNET CONNECTION</h1>
            <div className="company-info">
              <p>
                <strong>WavesNett Technologies Inc.</strong>
              </p>
              <p>
                Zars Mansion Near Water Tank, Yadulla Colony, Gulbarga – 585104
              </p>
              <p>Email: info@wavesnett.com | Phone: +91-XXXXXXXXXX</p>
            </div>
            <div className="form-info">
              <p>
                <strong>Unique ID:</strong>{" "}
                {formData.uniqueId || "FORM-" + Date.now()}
              </p>
              <p>
                <strong>Submitted on:</strong>{" "}
                {formatDate(formData.createdAt || new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <section className="form-section">
        <h2>1. Customer Details</h2>
        <table className="view-table">
          <tbody>
            <tr>
              <td className="label-cell">Full Name</td>
              <td className="value-cell">
                {formData.customerDetails?.fullName || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Father's / Spouse's Name</td>
              <td className="value-cell">
                {formData.customerDetails?.fatherSpouseName || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Date of Birth</td>
              <td className="value-cell">
                {formatDate(formData.customerDetails?.dob)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Gender</td>
              <td className="value-cell">
                {formData.customerDetails?.gender || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Email ID</td>
              <td className="value-cell">
                {formData.customerDetails?.email || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Mobile Number</td>
              <td className="value-cell">
                {formData.customerDetails?.mobileNumber || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Alternate Number</td>
              <td className="value-cell">
                {formData.customerDetails?.alternateNumber || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">ID Proof Type</td>
              <td className="value-cell">
                {formData.customerDetails?.idProofType || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">ID Proof Number</td>
              <td className="value-cell">
                {formData.customerDetails?.idProofNumber || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">ID Proof Copy Attached</td>
              <td className="value-cell">
                {formData.customerDetails?.idProofCopyAttached || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Installation Address */}
      <section className="form-section">
        <h2>2. Installation Address</h2>
        <table className="view-table">
          <tbody>
            <tr>
              <td className="label-cell">House / Flat No.</td>
              <td className="value-cell">
                {formData.installationAddress?.houseFlatNo || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Street / Locality</td>
              <td className="value-cell">
                {formData.installationAddress?.streetLocality || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">City / Town</td>
              <td className="value-cell">
                {formData.installationAddress?.city || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">District</td>
              <td className="value-cell">
                {formData.installationAddress?.district || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">State</td>
              <td className="value-cell">
                {formData.installationAddress?.state || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">PIN Code</td>
              <td className="value-cell">
                {formData.installationAddress?.pinCode || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Landmark</td>
              <td className="value-cell">
                {formData.installationAddress?.landmark || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">GPS Coordinates</td>
              <td className="value-cell">
                {formData.installationAddress?.gpsLat &&
                formData.installationAddress?.gpsLong
                  ? `Lat: ${formData.installationAddress.gpsLat}, Long: ${formData.installationAddress.gpsLong}`
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Service Details */}
      <section className="form-section">
        <h2>3. Service Details</h2>
        <table className="view-table">
          <tbody>
            <tr>
              <td className="label-cell">Internet Plan</td>
              <td className="value-cell">
                {formData.serviceDetails?.internetPlan || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Speed / Data Limit</td>
              <td className="value-cell">
                {formData.serviceDetails?.speedDataLimit || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Billing Cycle</td>
              <td className="value-cell">
                {formData.serviceDetails?.billingCycle || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Installation Date (Preferred)</td>
              <td className="value-cell">
                {formatDate(formData.serviceDetails?.installationDate)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Static IP Required</td>
              <td className="value-cell">
                {formData.serviceDetails?.staticIpRequired || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Additional Services</td>
              <td className="value-cell">
                {formData.serviceDetails?.additionalServices || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Payment Details */}
      <section className="form-section">
        <h2>4. Payment Details</h2>
        <table className="view-table">
          <tbody>
            <tr>
              <td className="label-cell">Security Deposit</td>
              <td className="value-cell">
                {formatCurrency(formData.paymentDetails?.securityDeposit)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Installation Charges</td>
              <td className="value-cell">
                {formatCurrency(formData.paymentDetails?.installationCharges)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">First Month Rental</td>
              <td className="value-cell">
                {formatCurrency(formData.paymentDetails?.firstMonthRental)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Total Amount Paid</td>
              <td className="value-cell">
                {formatCurrency(formData.paymentDetails?.totalAmountPaid)}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Payment Mode</td>
              <td className="value-cell">
                {formData.paymentDetails?.paymentMode || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Transaction / Receipt No.</td>
              <td className="value-cell">
                {formData.paymentDetails?.transactionReceiptNo || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Declaration */}
      <section className="form-section">
        <h2>5. Declaration</h2>
        <div className="declaration-content">
          <div className="declaration-text-view">
            {formData.declaration?.declarationText || "N/A"}
          </div>
          <div className="signature-section">
            <div className="signature-label">Customer Signature:</div>
            {formData.declaration?.signature ? (
              <SignatureCanvas
                signatureData={formData.declaration.signature}
                disabled={true}
              />
            ) : (
              <div className="no-signature">No signature provided</div>
            )}
            <div className="signature-date">
              <strong>Date:</strong>{" "}
              {formatDate(formData.declaration?.declarationDate)}
            </div>
          </div>
        </div>
      </section>

      {/* For Office Use Only */}
      {formData.officeUse && (
        <section className="form-section office-section">
          <h2>For Office Use Only</h2>
          <table className="view-table">
            <tbody>
              <tr>
                <td className="label-cell">Customer ID</td>
                <td className="value-cell">
                  {formData.officeUse.cafNo || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Plan Activated On</td>
                <td className="value-cell">
                  {formatDate(formData.officeUse.planActivatedOn)}
                </td>
              </tr>
              <tr>
                <td className="label-cell">MAC / ONU Serial No.</td>
                <td className="value-cell">
                  {formData.officeUse.macOnuSerialNo || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">OLT Port / VLAN Assigned</td>
                <td className="value-cell">
                  {formData.officeUse.oltPortVlanAssigned || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Handled By (Staff Name)</td>
                <td className="value-cell">
                  {formData.officeUse.handledBy || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={onBackToForm} className="back-button">
          ← New Application
        </button>
        <button onClick={handleDownloadPDF} className="back-button print-button">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default FormView;
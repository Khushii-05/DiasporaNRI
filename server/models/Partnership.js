const mongoose = require('mongoose');

const PartnershipSchema = new mongoose.Schema({
  // Applicant Information
  fullName: { type: String, required: true },
  fathersHusbandsName: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  profession: { type: String, required: true },
  organizationName: { type: String },
  designation: { type: String },

  // Contact Details
  mobileNumber: { type: String, required: true },
  alternateMobileNumber: { type: String },
  email: { type: String, required: true },
  website: { type: String },

  // Permanent Address
  permanentHouseNo: { type: String },
  permanentStreet: { type: String },
  permanentCity: { type: String },
  permanentState: { type: String },
  permanentPinCode: { type: String },
  permanentCountry: { type: String },

  // Office / Business Address
  officeName: { type: String },
  officeAddress: { type: String },
  officeCity: { type: String },
  officeState: { type: String },
  officePinCode: { type: String },

  // Partnership Category
  partnershipCategory: { type: String, required: true },
  otherCategory: { type: String },

  // Professional Background & Experience
  yearsOfExperience: { type: Number },
  areaOfExpertise: { type: String },
  previousOrganizations: { type: String },
  currentBusinessActivities: { type: String },

  // KYC & Identity Verification - Mandatory Documents
  kycDocuments: {
    aadhaarCard: { type: Boolean, default: false },
    panCard: { type: Boolean, default: false },
    passport: { type: Boolean, default: false },
    voterId: { type: Boolean, default: false },
    drivingLicense: { type: Boolean, default: false },
    photograph: { type: Boolean, default: false }
  },

  // Business Documents
  businessDocuments: {
    gstCertificate: { type: Boolean, default: false },
    msmeCertificate: { type: Boolean, default: false },
    tradeLicense: { type: Boolean, default: false },
    companyRegistration: { type: Boolean, default: false },
    partnershipDeed: { type: Boolean, default: false },
    shopEstablishment: { type: Boolean, default: false }
  },

  // Financial Documents
  financialDocuments: {
    bankPassbook: { type: Boolean, default: false },
    bankStatement: { type: Boolean, default: false },
    incomeTaxReturn: { type: Boolean, default: false }
  },

  // Reference Details
  reference1: {
    name: { type: String },
    organization: { type: String },
    mobileNumber: { type: String },
    relationship: { type: String }
  },
  reference2: {
    name: { type: String },
    organization: { type: String },
    mobileNumber: { type: String },
    relationship: { type: String }
  },

  // Proposed Area of Operation
  proposedAreaOfOperation: { type: String },

  // Infrastructure Availability
  infrastructure: {
    officeSpace: { type: Boolean, default: false },
    computer: { type: Boolean, default: false },
    internetConnectivity: { type: Boolean, default: false },
    staffAvailable: { type: Boolean, default: false },
    vehicleFacility: { type: Boolean, default: false },
    diagnosticInfrastructure: { type: Boolean, default: false },
    telecommunicationFacility: { type: Boolean, default: false }
  },

  // Declaration & Agreement
  declaration: { type: Boolean, default: false },
  applicantSignature: { type: String },
  signatureDate: { type: Date },
  signaturePlace: { type: String },

  // Status tracking
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  kycStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  verifiedBy: { type: String },
  verificationDate: { type: Date },
  userId: { type: String }, // Firebase UID of the applicant
  
  read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Partnership', PartnershipSchema);

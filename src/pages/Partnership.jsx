import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitPartnershipApplication } from '../services/partnershipService';
import Icon from '../components/Icon';

const PARTNERSHIP_CATEGORIES = [
  'Business Associate',
  'Marketing Partner',
  'Healthcare Partner',
  'Tele-Centre Franchise Partner',
  'Insurance Associate',
  'Diagnostic Partner',
  'Consultant / Advisor',
  'Investor / Strategic Partner',
  'Vendor / Supplier',
  'Other'
];

export default function Partnership() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    fathersHusbandsName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    profession: '',
    organizationName: '',
    designation: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    email: currentUser?.email || '',
    website: '',
    permanentHouseNo: '',
    permanentStreet: '',
    permanentCity: '',
    permanentState: '',
    permanentPinCode: '',
    permanentCountry: '',
    officeName: '',
    officeAddress: '',
    officeCity: '',
    officeState: '',
    officePinCode: '',
    partnershipCategory: '',
    otherCategory: '',
    yearsOfExperience: '',
    areaOfExpertise: '',
    previousOrganizations: '',
    currentBusinessActivities: '',
    reference1: { name: '', organization: '', mobileNumber: '', relationship: '' },
    reference2: { name: '', organization: '', mobileNumber: '', relationship: '' },
    proposedAreaOfOperation: '',
    infrastructure: {
      officeSpace: false,
      computer: false,
      internetConnectivity: false,
      staffAvailable: false,
      vehicleFacility: false,
      diagnosticInfrastructure: false,
      telecommunicationFacility: false
    },
    declaration: false,
    applicantSignature: '',
    signatureDate: '',
    signaturePlace: ''
  });

  const [documentFiles, setDocumentFiles] = useState({
    kycDocuments: {},
    businessDocuments: {},
    financialDocuments: {}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleFileChange = (category, docType, file) => {
    setDocumentFiles(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [docType]: file
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.profession && formData.gender && formData.nationality;
      case 2:
        return formData.mobileNumber && formData.email && (formData.mobileNumber.length >= 10);
      case 3:
        return formData.permanentCity && formData.permanentState && formData.permanentCountry;
      case 4:
        return formData.partnershipCategory && (formData.partnershipCategory !== 'Other' || formData.otherCategory);
      case 5:
        return true;
      case 6:
        // Check required personal documents
        const hasPAN = documentFiles.kycDocuments['pancard'];
        const hasPhoto = documentFiles.kycDocuments['photograph'];
        const hasPassport = documentFiles.kycDocuments['passport'];
        const hasAadharOrDL = documentFiles.kycDocuments['aadhaarcard'] || documentFiles.kycDocuments['drivinglicense'];
        
        // Check business documents - at least 2 business docs + shop photo
        const businessDocsCount = ['gstcertificate', 'msmecertificate', 'tradelicense', 'companyregistration', 'partnershipdeed']
          .filter(doc => documentFiles.businessDocuments[doc]).length;
        const hasShopPhoto = documentFiles.businessDocuments['shopofficeestablishmentphoto'];
        
        return hasPAN && hasPhoto && hasPassport && hasAadharOrDL && businessDocsCount >= 2 && hasShopPhoto;
      case 7:
        return true;
      case 8:
        return true;
      case 9:
        return formData.declaration && formData.applicantSignature && formData.signatureDate;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
        setError('');
      }
    } else {
      let errorMsg = 'Please fill all required fields in this section before proceeding.';
      
      if (currentStep === 6) {
        const hasPAN = documentFiles.kycDocuments['pancard'];
        const hasPhoto = documentFiles.kycDocuments['photograph'];
        const hasPassport = documentFiles.kycDocuments['passport'];
        const hasAadharOrDL = documentFiles.kycDocuments['aadhaarcard'] || documentFiles.kycDocuments['drivinglicense'];
        const businessDocsCount = ['gstcertificate', 'msmecertificate', 'tradelicense', 'companyregistration', 'partnershipdeed']
          .filter(doc => documentFiles.businessDocuments[doc]).length;
        const hasShopPhoto = documentFiles.businessDocuments['shopofficeestablishmentphoto'];
        
        let missingDocs = [];
        if (!hasPAN) missingDocs.push('PAN Card');
        if (!hasPhoto) missingDocs.push('Photograph');
        if (!hasPassport) missingDocs.push('Passport');
        if (!hasAadharOrDL) missingDocs.push('Aadhaar Card or Driving License');
        if (businessDocsCount < 2) missingDocs.push(`at least 2 Business Documents (currently ${businessDocsCount})`);
        if (!hasShopPhoto) missingDocs.push('Shop/Office Establishment Photo');
        
        errorMsg = `Please upload the following required documents: ${missingDocs.join(', ')}`;
      }
      
      setError(errorMsg);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requiredFields = [
        formData.fullName,
        formData.mobileNumber,
        formData.email,
        formData.profession,
        formData.partnershipCategory,
        formData.permanentCity,
        formData.declaration,
        formData.applicantSignature,
        formData.signatureDate
      ];

      if (requiredFields.some(field => !field)) {
        setError('Please ensure all required fields are filled.');
        setLoading(false);
        return;
      }

      if (!formData.declaration) {
        setError('You must agree to the declaration and terms.');
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        kycDocuments: Object.keys(documentFiles.kycDocuments).reduce((acc, key) => {
          acc[key] = !!documentFiles.kycDocuments[key];
          return acc;
        }, {}),
        businessDocuments: Object.keys(documentFiles.businessDocuments).reduce((acc, key) => {
          acc[key] = !!documentFiles.businessDocuments[key];
          return acc;
        }, {}),
        financialDocuments: Object.keys(documentFiles.financialDocuments).reduce((acc, key) => {
          acc[key] = !!documentFiles.financialDocuments[key];
          return acc;
        }, {})
      };

      // Get Firebase token for authentication
      const token = await currentUser.getIdToken();
      await submitPartnershipApplication(submissionData, token);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-300 mb-6">Please login to submit a partnership application.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-8 text-center max-w-md">
          <Icon name="check" className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-300 mb-6">Thank you for your interest in partnering with us. We will review your application and get back to you shortly.</p>
          <p className="text-sm text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Applicant Info' },
    { num: 2, title: 'Contact' },
    { num: 3, title: 'Address' },
    { num: 4, title: 'Partnership' },
    { num: 5, title: 'Experience' },
    { num: 6, title: 'Documents' },
    { num: 7, title: 'References' },
    { num: 8, title: 'Infrastructure' },
    { num: 9, title: 'Declaration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Partnership Registration Form</h1>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-2 pb-4">
            {steps.map(step => (
              <button
                key={step.num}
                onClick={() => {
                  if (step.num <= currentStep || (step.num === currentStep + 1 && validateStep(currentStep))) {
                    setCurrentStep(step.num);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentStep === step.num
                    ? 'bg-blue-600 text-white'
                    : step.num < currentStep || (step.num === currentStep && validateStep(currentStep))
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 cursor-pointer'
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  currentStep === step.num ? 'bg-white text-blue-600' : 'bg-slate-600'
                }`}>
                  {step.num}
                </div>
                <span className="hidden sm:inline text-sm">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
          {/* Step 1: Applicant Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Applicant Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Father's / Husband's Name</label>
                  <input
                    type="text"
                    name="fathersHusbandsName"
                    value={formData.fathersHusbandsName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nationality *</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profession / Occupation *</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organization / Firm Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number * (Min 10 digits)</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Alternate Mobile</label>
                  <input
                    type="tel"
                    name="alternateMobileNumber"
                    value={formData.alternateMobileNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website / Social Media</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Permanent Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">House No./Building</label>
                  <input type="text" name="permanentHouseNo" value={formData.permanentHouseNo} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Street / Area</label>
                  <input type="text" name="permanentStreet" value={formData.permanentStreet} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input type="text" name="permanentCity" value={formData.permanentCity} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                  <input type="text" name="permanentState" value={formData.permanentState} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code</label>
                  <input type="text" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <input type="text" name="permanentCountry" value={formData.permanentCountry} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mt-8">Office / Business Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Office Name</label>
                  <input type="text" name="officeName" value={formData.officeName} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input type="text" name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">City</label><input type="text" name="officeCity" value={formData.officeCity} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">State</label><input type="text" name="officeState" value={formData.officeState} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">PIN Code</label><input type="text" name="officePinCode" value={formData.officePinCode} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              </div>
            </div>
          )}

          {/* Step 4: Partnership Category */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Partnership Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PARTNERSHIP_CATEGORIES.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="partnershipCategory" value={category} checked={formData.partnershipCategory === category} onChange={handleInputChange} className="w-4 h-4" required />
                    <span className="text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
              {formData.partnershipCategory === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Please Specify *</label>
                  <input type="text" name="otherCategory" value={formData.otherCategory} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              )}

              <h3 className="text-xl font-bold text-white mt-8">Proposed Area of Operation</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State / District / City</label>
                <input type="text" name="proposedAreaOfOperation" value={formData.proposedAreaOfOperation} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {/* Step 5: Experience */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Professional Background & Experience</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Years of Experience</label>
                  <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Area of Expertise</label>
                  <textarea name="areaOfExpertise" value={formData.areaOfExpertise} onChange={handleInputChange} rows="4" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Previous Organizations</label>
                  <textarea name="previousOrganizations" value={formData.previousOrganizations} onChange={handleInputChange} rows="4" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Business Activities</label>
                  <textarea name="currentBusinessActivities" value={formData.currentBusinessActivities} onChange={handleInputChange} rows="4" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Documents - FILE UPLOAD */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Required Documents Upload</h2>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Personal & Identity Documents * (All Required)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['PAN Card', 'Photograph', 'Passport', 'Aadhaar Card', 'Driving License'].map(doc => (
                    <div key={doc} className="border border-slate-600 rounded p-4 bg-slate-700/50">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{doc} {['PAN Card', 'Photograph', 'Passport'].includes(doc) ? '*' : '(or Aadhaar)'}</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange('kycDocuments', doc.toLowerCase().replace(/\s+/g, ''), e.target.files?.[0])}
                        className="w-full text-sm text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
                      />
                      {documentFiles.kycDocuments[doc.toLowerCase().replace(/\s+/g, '')] && (
                        <p className="text-xs text-green-400 mt-2">✓ {documentFiles.kycDocuments[doc.toLowerCase().replace(/\s+/g, '')].name}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">Note: PAN, Photograph, and Passport are mandatory. Upload either Aadhaar Card or Driving License.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Business Documents * (Upload any 2 + Shop/Office Photo)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['GST Certificate', 'MSME Certificate', 'Trade License', 'Company Registration', 'Partnership Deed'].map(doc => (
                    <div key={doc} className="border border-slate-600 rounded p-4 bg-slate-700/50">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{doc}</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange('businessDocuments', doc.toLowerCase().replace(/\s+/g, ''), e.target.files?.[0])}
                        className="w-full text-sm text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
                      />
                      {documentFiles.businessDocuments[doc.toLowerCase().replace(/\s+/g, '')] && (
                        <p className="text-xs text-green-400 mt-2">✓ {documentFiles.businessDocuments[doc.toLowerCase().replace(/\s+/g, '')].name}</p>
                      )}
                    </div>
                  ))}
                  <div className="border border-slate-600 rounded p-4 bg-slate-700/50">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Shop/Office Establishment Photo *</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('businessDocuments', 'shopofficeestablishmentphoto', e.target.files?.[0])}
                      className="w-full text-sm text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
                    />
                    {documentFiles.businessDocuments['shopofficeestablishmentphoto'] && (
                      <p className="text-xs text-green-400 mt-2">✓ {documentFiles.businessDocuments['shopofficeestablishmentphoto'].name}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">Note: Upload any 2 business documents + a photo of your shop/office front.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Financial Documents (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Bank Passbook'].map(doc => (
                    <div key={doc} className="border border-slate-600 rounded p-4 bg-slate-700/50">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{doc}</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange('financialDocuments', doc.toLowerCase().replace(/\s+/g, ''), e.target.files?.[0])}
                        className="w-full text-sm text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-2 file:cursor-pointer hover:file:bg-blue-700"
                      />
                      {documentFiles.financialDocuments[doc.toLowerCase().replace(/\s+/g, '')] && (
                        <p className="text-xs text-green-400 mt-2">✓ {documentFiles.financialDocuments[doc.toLowerCase().replace(/\s+/g, '')].name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: References */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Reference Details</h2>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Reference 1</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Name</label><input type="text" value={formData.reference1.name} onChange={(e) => handleNestedInputChange('reference1', 'name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Organization</label><input type="text" value={formData.reference1.organization} onChange={(e) => handleNestedInputChange('reference1', 'organization', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label><input type="tel" value={formData.reference1.mobileNumber} onChange={(e) => handleNestedInputChange('reference1', 'mobileNumber', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label><input type="text" value={formData.reference1.relationship} onChange={(e) => handleNestedInputChange('reference1', 'relationship', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Reference 2</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Name</label><input type="text" value={formData.reference2.name} onChange={(e) => handleNestedInputChange('reference2', 'name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Organization</label><input type="text" value={formData.reference2.organization} onChange={(e) => handleNestedInputChange('reference2', 'organization', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label><input type="tel" value={formData.reference2.mobileNumber} onChange={(e) => handleNestedInputChange('reference2', 'mobileNumber', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label><input type="text" value={formData.reference2.relationship} onChange={(e) => handleNestedInputChange('reference2', 'relationship', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Infrastructure */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Infrastructure Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(formData.infrastructure).map(infra => (
                  <label key={infra} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.infrastructure[infra]} onChange={() => handleCheckboxChange('infrastructure', infra)} className="w-4 h-4" />
                    <span className="text-gray-300">{infra.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: Declaration */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Declaration & Signature</h2>
              
              <div className="bg-slate-700 rounded p-4">
                <p className="text-gray-300 leading-relaxed">
                  I hereby declare that all information provided in this application form and attached documents are true and correct to the best of my knowledge and belief. I understand that submission of false information or forged documents may lead to rejection or termination of partnership at any stage.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  I further agree to comply with the policies, operational guidelines, compliance requirements, and professional standards prescribed by the organization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Applicant Signature *</label><input type="text" name="applicantSignature" value={formData.applicantSignature} onChange={handleInputChange} placeholder="Type your name as signature" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Signature Date *</label><input type="date" name="signatureDate" value={formData.signatureDate} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-2">Place</label><input type="text" name="signaturePlace" value={formData.signaturePlace} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.declaration} onChange={(e) => setFormData(prev => ({ ...prev, declaration: e.target.checked }))} className="w-5 h-5 mt-1" required />
                <span className="text-gray-300">I agree to the declaration above and accept the terms and conditions *</span>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
            >
              Previous
            </button>
            
            {currentStep < 9 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.declaration}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

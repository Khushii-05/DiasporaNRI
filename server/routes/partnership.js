const express = require('express');
const Partnership = require('../models/Partnership');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

// Public: Submit partnership registration form
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const {
      // Applicant Information
      fullName,
      fathersHusbandsName,
      dateOfBirth,
      gender,
      nationality,
      profession,
      organizationName,
      designation,

      // Contact Details
      mobileNumber,
      alternateMobileNumber,
      email,
      website,

      // Permanent Address
      permanentHouseNo,
      permanentStreet,
      permanentCity,
      permanentState,
      permanentPinCode,
      permanentCountry,

      // Office / Business Address
      officeName,
      officeAddress,
      officeCity,
      officeState,
      officePinCode,

      // Partnership Category
      partnershipCategory,
      otherCategory,

      // Professional Background & Experience
      yearsOfExperience,
      areaOfExpertise,
      previousOrganizations,
      currentBusinessActivities,

      // KYC Documents
      kycDocuments,
      businessDocuments,
      financialDocuments,

      // Reference Details
      reference1,
      reference2,

      // Proposed Area of Operation
      proposedAreaOfOperation,

      // Infrastructure Availability
      infrastructure,

      // Declaration
      declaration,
      applicantSignature,
      signatureDate,
      signaturePlace
    } = req.body;

    // Validate required fields
    if (!fullName || !mobileNumber || !email || !profession || !partnershipCategory) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const partnership = await Partnership.create({
      fullName,
      fathersHusbandsName,
      dateOfBirth,
      gender,
      nationality,
      profession,
      organizationName,
      designation,
      mobileNumber,
      alternateMobileNumber,
      email,
      website,
      permanentHouseNo,
      permanentStreet,
      permanentCity,
      permanentState,
      permanentPinCode,
      permanentCountry,
      officeName,
      officeAddress,
      officeCity,
      officeState,
      officePinCode,
      partnershipCategory,
      otherCategory,
      yearsOfExperience,
      areaOfExpertise,
      previousOrganizations,
      currentBusinessActivities,
      kycDocuments: kycDocuments || {},
      businessDocuments: businessDocuments || {},
      financialDocuments: financialDocuments || {},
      reference1: reference1 || {},
      reference2: reference2 || {},
      proposedAreaOfOperation,
      infrastructure: infrastructure || {},
      declaration,
      applicantSignature,
      signatureDate,
      signaturePlace,
      userId: req.user.uid,
      status: 'Pending',
      kycStatus: 'Pending'
    });

    console.log(`[Partnership] Application created: ${partnership._id}`);
    return res.json({ partnership });
  } catch (error) {
    console.error('[Partnership] Submission error:', error.message);
    return res.status(500).json({ error: 'Failed to submit partnership application' });
  }
});

// Get all partnerships (Admin only)
router.get('/', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const partnerships = await Partnership.find().sort({ createdAt: -1 });
    return res.json({ partnerships });
  } catch (error) {
    console.error('[Partnership] Fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
});

// Get single partnership (Admin only)
router.get('/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }
    return res.json({ partnership });
  } catch (error) {
    console.error('[Partnership] Fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch partnership' });
  }
});

// Update partnership status (Admin only)
router.put('/:id/status', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { status, kycStatus, remarks, verifiedBy } = req.body;

    if (!status && !kycStatus && !remarks) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (kycStatus) updateData.kycStatus = kycStatus;
    if (remarks) updateData.remarks = remarks;
    if (verifiedBy) updateData.verifiedBy = verifiedBy;
    updateData.verificationDate = new Date();

    const partnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    console.log(`[Partnership] Status updated: ${partnership._id}`);
    return res.json({ partnership });
  } catch (error) {
    console.error('[Partnership] Update error:', error.message);
    return res.status(500).json({ error: 'Failed to update partnership' });
  }
});

// Mark as read (Admin only)
router.put('/:id/read', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    return res.json({ partnership });
  } catch (error) {
    console.error('[Partnership] Read error:', error.message);
    return res.status(500).json({ error: 'Failed to update read status' });
  }
});

// Delete partnership (Admin only)
router.delete('/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndDelete(req.params.id);

    if (!partnership) {
      return res.status(404).json({ error: 'Partnership not found' });
    }

    console.log(`[Partnership] Application deleted: ${partnership._id}`);
    return res.json({ success: true });
  } catch (error) {
    console.error('[Partnership] Delete error:', error.message);
    return res.status(500).json({ error: 'Failed to delete partnership' });
  }
});

module.exports = { partnershipRouter: router };

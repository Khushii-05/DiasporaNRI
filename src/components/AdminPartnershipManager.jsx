import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import {
  getPartnershipApplications,
  updatePartnershipStatus,
  markPartnershipAsRead,
  deletePartnershipApplication
} from '../services/partnershipService';

export default function AdminPartnershipManager() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, unread
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycStatusFilter, setKycStatusFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, [currentUser]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setApplications([]);
        return;
      }

      const token = await currentUser.getIdToken();
      const data = await getPartnershipApplications(token);
      setApplications(data || []);
    } catch (err) {
      setError('Failed to load partnership applications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      const token = await currentUser.getIdToken();
      await updatePartnershipStatus(token, appId, {
        status,
        verifiedBy: currentUser.email
      });
      setSuccess(`Status updated to ${status}!`);
      await loadApplications();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  const handleKycStatusUpdate = async (appId, kycStatus) => {
    try {
      const token = await currentUser.getIdToken();
      await updatePartnershipStatus(token, appId, {
        kycStatus,
        verifiedBy: currentUser.email
      });
      setSuccess(`KYC Status updated to ${kycStatus}!`);
      await loadApplications();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update KYC status: ' + err.message);
    }
  };

  const handleMarkAsRead = async (appId) => {
    try {
      const token = await currentUser.getIdToken();
      await markPartnershipAsRead(token, appId);
      setSuccess('Marked as read!');
      await loadApplications();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to mark as read: ' + err.message);
    }
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Delete this partnership application permanently? This action cannot be undone.')) {
      try {
        const token = await currentUser.getIdToken();
        await deletePartnershipApplication(token, appId);
        setSuccess('Application deleted successfully!');
        await loadApplications();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete application: ' + err.message);
      }
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;

    if (filter === 'unread') {
      filtered = filtered.filter(a => !a.read);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (kycStatusFilter !== 'all') {
      filtered = filtered.filter(a => a.kycStatus === kycStatusFilter);
    }

    return filtered;
  };

  const filteredApps = getFilteredApplications();
  const unreadCount = applications.filter(a => !a.read).length;
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-600/20 border-green-500 text-green-400';
      case 'Rejected':
        return 'bg-red-600/20 border-red-500 text-red-400';
      case 'Pending':
      default:
        return 'bg-yellow-600/20 border-yellow-500 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon name="briefcase" className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Partnership Applications</h2>
        </div>
        <div className="text-sm text-gray-400">
          Total: <span className="text-white font-bold">{applications.length}</span>
          {unreadCount > 0 && (
            <>
              {' '} • Unread: <span className="text-red-400 font-bold">{unreadCount}</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-3xl font-bold text-white">{applications.length}</p>
        </div>
        <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-600">
          <p className="text-yellow-200 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-green-600/20 rounded-lg p-4 border border-green-600">
          <p className="text-green-200 text-sm">Approved</p>
          <p className="text-3xl font-bold text-green-400">{approvedCount}</p>
        </div>
        <div className="bg-red-600/20 rounded-lg p-4 border border-red-600">
          <p className="text-red-200 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-400">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Icon name="list" className="w-5 h-5" />
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Icon name="bell" className="w-5 h-5" />
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-700 text-gray-300 border border-slate-600 focus:border-blue-500 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={kycStatusFilter}
            onChange={(e) => setKycStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-700 text-gray-300 border border-slate-600 focus:border-blue-500 text-sm"
          >
            <option value="all">All KYC Status</option>
            <option value="Pending">KYC Pending</option>
            <option value="Approved">KYC Approved</option>
            <option value="Rejected">KYC Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => (
            <div
              key={app._id}
              className={`border rounded-lg overflow-hidden transition ${
                app.read
                  ? 'bg-slate-800/30 border-slate-700/50'
                  : 'bg-slate-800/50 border-blue-400/50'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                className="w-full p-6 text-left hover:bg-slate-700/20 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {!app.read && (
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                      <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                      <span className={`text-xs border rounded px-2 py-1 ${getStatusBadgeColor(app.status)}`}>
                        {app.status}
                      </span>
                      <span className={`text-xs border rounded px-2 py-1 ${
                        app.kycStatus === 'Approved' ? 'bg-green-600/20 border-green-500 text-green-400' :
                        app.kycStatus === 'Rejected' ? 'bg-red-600/20 border-red-500 text-red-400' :
                        'bg-yellow-600/20 border-yellow-500 text-yellow-400'
                      }`}>
                        KYC: {app.kycStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-gray-200">{app.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-gray-200">{app.mobileNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Category</p>
                        <p className="text-gray-200">{app.partnershipCategory}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Profession</p>
                        <p className="text-gray-200">{app.profession}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === app._id && (
                <div className="px-6 pb-6 border-t border-slate-700 space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Full Name</p>
                      <p className="text-gray-300">{app.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Father's / Husband's Name</p>
                      <p className="text-gray-300">{app.fathersHusbandsName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Date of Birth</p>
                      <p className="text-gray-300">
                        {app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Gender</p>
                      <p className="text-gray-300">{app.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Nationality</p>
                      <p className="text-gray-300">{app.nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1">Designation</p>
                      <p className="text-gray-300">{app.designation || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-white font-bold mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Mobile</p>
                        <a href={`tel:${app.mobileNumber}`} className="text-blue-400 hover:text-blue-300">
                          {app.mobileNumber}
                        </a>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Alternate Mobile</p>
                        <p className="text-gray-300">{app.alternateMobileNumber || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-sm font-semibold mb-1">Email</p>
                        <a href={`mailto:${app.email}`} className="text-blue-400 hover:text-blue-300">
                          {app.email}
                        </a>
                      </div>
                      {app.website && (
                        <div className="md:col-span-2">
                          <p className="text-gray-400 text-sm font-semibold mb-1">Website / Social Media</p>
                          <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                            {app.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-white font-bold mb-4">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Years of Experience</p>
                        <p className="text-gray-300">{app.yearsOfExperience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Organization Name</p>
                        <p className="text-gray-300">{app.organizationName || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-sm font-semibold mb-1">Area of Expertise</p>
                        <p className="text-gray-300 whitespace-pre-wrap">{app.areaOfExpertise || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-sm font-semibold mb-1">Current Business Activities</p>
                        <p className="text-gray-300 whitespace-pre-wrap">{app.currentBusinessActivities || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-white font-bold mb-4">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Permanent City</p>
                        <p className="text-gray-300">{app.permanentCity || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Permanent State</p>
                        <p className="text-gray-300">{app.permanentState || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Proposed Area of Operation</p>
                        <p className="text-gray-300">{app.proposedAreaOfOperation || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Update Section */}
                  <div className="border-t border-slate-700 pt-4 bg-slate-900/30 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-4">Application Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-2">Partnership Status</p>
                        <div className="flex gap-2 flex-wrap">
                          {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(app._id, status)}
                              className={`px-3 py-1 rounded text-sm font-semibold transition ${
                                app.status === status
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-2">KYC Status</p>
                        <div className="flex gap-2 flex-wrap">
                          {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                              key={status}
                              onClick={() => handleKycStatusUpdate(app._id, status)}
                              className={`px-3 py-1 rounded text-sm font-semibold transition ${
                                app.kycStatus === status
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {app.verifiedBy && (
                      <div className="mt-3 text-xs text-gray-400">
                        Verified by {app.verifiedBy} on {new Date(app.verificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    {!app.read && (
                      <button
                        onClick={() => handleMarkAsRead(app._id)}
                        className="flex-1 min-w-max bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Icon name="check" className="w-5 h-5" />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="flex-1 min-w-max bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Icon name="delete" className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

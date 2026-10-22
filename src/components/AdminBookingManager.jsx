import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import { getAllBookings, updateBooking, deleteBooking } from '../services/bookingService';

export default function AdminBookingManager() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    status: '',
    adminNotes: '',
    meetingLink: '',
    meetingDetails: ''
  });

  useEffect(() => {
    loadBookings();
  }, [currentUser, filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setBookings([]);
        return;
      }

      const token = await currentUser.getIdToken();
      const data = await getAllBookings(token, filter);
      const normalized = data.map(item => ({
        id: item.id || item._id,
        userId: item.userId,
        userName: item.userName,
        userEmail: item.userEmail,
        userPhone: item.userPhone,
        meetingDate: item.meetingDate,
        meetingTime: item.meetingTime,
        duration: item.duration,
        timeZone: item.timeZone,
        serviceType: item.serviceType,
        preparationDetails: item.preparationDetails,
        additionalInfo: item.additionalInfo,
        status: item.status,
        adminNotes: item.adminNotes,
        meetingLink: item.meetingLink,
        meetingDetails: item.meetingDetails,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setBookings(normalized);
    } catch (err) {
      setError('Failed to load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditData({
      status: booking.status,
      adminNotes: booking.adminNotes,
      meetingLink: booking.meetingLink,
      meetingDetails: booking.meetingDetails
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (bookingId) => {
    try {
      const token = await currentUser.getIdToken();
      await updateBooking(bookingId, editData, token);
      
      // Show success message with action taken
      const actionMessage = editData.status === 'confirmed' 
        ? 'Booking confirmed and email sent to user! 📧' 
        : `Booking status updated to ${editData.status}`;
      
      setSuccess(actionMessage);
      setEditingId(null);
      await loadBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update booking: ' + err.message);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Delete this booking permanently? This action cannot be undone.')) {
      try {
        const token = await currentUser.getIdToken();
        await deleteBooking(bookingId, token);
        setSuccess('Booking deleted successfully!');
        await loadBookings();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete booking: ' + err.message);
      }
    }
  };

  const formatDateTime = (date, time) => {
    try {
      const dateObj = new Date(date);
      return `${dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })} at ${time}`;
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'no-show':
        return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const upcomingCount = bookings.filter(b => new Date(b.meetingDate) > new Date()).length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-700/30 border border-blue-400/30 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-400">{bookings.length}</p>
        </div>
        <div className="bg-slate-700/30 border border-green-400/30 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm mb-2">Confirmed</h3>
          <p className="text-3xl font-bold text-green-400">{confirmedCount}</p>
        </div>
        <div className="bg-slate-700/30 border border-yellow-400/30 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-slate-700/30 border border-cyan-400/30 p-4 rounded-lg">
          <h3 className="text-gray-300 text-sm mb-2">Upcoming</h3>
          <p className="text-3xl font-bold text-cyan-400">{upcomingCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="alert" className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg flex items-center gap-2">
          <Icon name="check" className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading bookings...</div>
      ) : getFilteredBookings().length === 0 ? (
        <div className="text-center py-12 text-gray-400">No bookings found</div>
      ) : (
        <div className="space-y-4">
          {getFilteredBookings().map(booking => (
            <div
              key={booking.id}
              className="bg-slate-700/30 border border-blue-400/30 rounded-lg overflow-hidden hover:border-blue-400/60 transition"
            >
              <div
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="p-6 cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">{booking.userName}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{booking.serviceType}</p>
                  <p className="text-sm text-gray-300">
                    📅 {formatDateTime(booking.meetingDate, booking.meetingTime)} ({booking.duration} min)
                  </p>
                </div>
                <div className="ml-4">
                  <Icon 
                    name={expandedId === booking.id ? "chevronUp" : "chevronDown"} 
                    className="w-6 h-6 text-blue-400"
                  />
                </div>
              </div>

              {expandedId === booking.id && (
                <div className="border-t border-blue-400/30 p-6 bg-slate-800/30 space-y-4">
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">User Information</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-400">Email:</span> {booking.userEmail}</p>
                        <p><span className="text-gray-400">Phone:</span> {booking.userPhone}</p>
                        <p><span className="text-gray-400">Time Zone:</span> {booking.timeZone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Meeting Details</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-400">Service:</span> {booking.serviceType}</p>
                        <p><span className="text-gray-400">Duration:</span> {booking.duration} minutes</p>
                        <p><span className="text-gray-400">Booked:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">User's Preparation Details</h4>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-400/20">
                      <p className="text-sm text-gray-300">{booking.preparationDetails}</p>
                    </div>
                  </div>

                  {booking.additionalInfo && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Additional Information</h4>
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-400/20">
                        <p className="text-sm text-gray-300">{booking.additionalInfo}</p>
                      </div>
                    </div>
                  )}

                  {/* Edit Section */}
                  {editingId === booking.id ? (
                    <div className="space-y-4 border-t border-blue-400/30 pt-4">
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mb-4">
                        <p className="text-xs text-blue-300 flex items-start gap-2">
                          <span>ℹ️</span>
                          <span>
                            <strong>Email Notifications:</strong> When you set status to "Confirmed", an email with the meeting link and details will be automatically sent to the user.
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Status</label>
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-400 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="no-show">No Show</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Meeting Link</label>
                        <input
                          type="url"
                          name="meetingLink"
                          value={editData.meetingLink}
                          onChange={handleEditChange}
                          placeholder="https://meet.google.com/..."
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Meeting Details</label>
                        <textarea
                          name="meetingDetails"
                          value={editData.meetingDetails}
                          onChange={handleEditChange}
                          placeholder="Any additional details for the user..."
                          rows="3"
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Admin Notes</label>
                        <textarea
                          name="adminNotes"
                          value={editData.adminNotes}
                          onChange={handleEditChange}
                          placeholder="Internal notes only..."
                          rows="3"
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveEdit(booking.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 border-t border-blue-400/30 pt-4">
                      {booking.meetingLink && (
                        <p className="text-sm text-gray-300">
                          <span className="text-gray-400">Meeting Link:</span>{' '}
                          <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            {booking.meetingLink}
                          </a>
                        </p>
                      )}
                      {booking.meetingDetails && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Meeting Details:</p>
                          <p className="text-sm text-gray-300">{booking.meetingDetails}</p>
                        </div>
                      )}
                      {booking.adminNotes && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-300">{booking.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {editingId !== booking.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Icon name="edit" className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

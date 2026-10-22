import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { submitContact } from '../services/contactService';
import { createBooking, getMyBookings, cancelBooking } from '../services/bookingService';
import { usePageContent } from '../hooks/usePageContent';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookingCalendar from '../components/BookingCalendar';

export default function Contact() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { getValue } = usePageContent('contact');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Booking Form State
  const [activeTab, setActiveTab] = useState('contact');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingData, setBookingData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    duration: '45',
    timeZone: 'Asia/Kolkata',
    serviceType: '',
    preparationDetails: '',
    additionalInfo: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const services = [
    'Property & Land Management',
    'Legal Support & Documentation',
    'Government & Administrative',
    'Banking & Financial Services',
    'Family Support & Representation',
    'Medical & Emergency Assistance',
    'Business Setup & Trade',
    'Real Estate & Asset Monitoring',
    'Verification & POA Services'
  ];

  // Load user bookings when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadMyBookings();
      // Pre-fill user data
      setBookingData(prev => ({
        ...prev,
        userName: currentUser.displayName || '',
        userEmail: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const loadMyBookings = async () => {
    if (!currentUser) return;
    try {
      setBookingsLoading(true);
      const token = await currentUser.getIdToken();
      const bookings = await getMyBookings(token);
      setMyBookings(bookings);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setMediaFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview('');
      }
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('subject', formData.subject);
      data.append('message', formData.message);
      
      // Append file if selected
      if (mediaFile) {
        data.append('file', mediaFile);
      }

      await submitContact(data);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setMediaFile(null);
      setMediaPreview('');
      
      const fileInput = document.querySelector('#media-input');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: '/contact' } });
      return;
    }

    // Validate that date and time are selected
    if (!selectedDate || !selectedTime) {
      setBookingError('Please select both date and time');
      return;
    }

    // Validate service type and phone
    if (!bookingData.serviceType || !bookingData.userPhone || !bookingData.preparationDetails) {
      setBookingError('Please fill in all required fields');
      return;
    }

    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      const token = await currentUser.getIdToken();
      
      // Format date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const bookingPayload = {
        userName: bookingData.userName,
        userEmail: bookingData.userEmail,
        userPhone: bookingData.userPhone,
        meetingDate: formattedDate,
        meetingTime: selectedTime,
        duration: parseInt(bookingData.duration),
        timeZone: bookingData.timeZone,
        serviceType: bookingData.serviceType,
        preparationDetails: bookingData.preparationDetails,
        additionalInfo: bookingData.additionalInfo
      };

      await createBooking(bookingPayload, token);
      
      setBookingSuccess('Meeting booked successfully! Check your bookings below.');
      setBookingData({
        userName: currentUser.displayName || '',
        userEmail: currentUser.email || '',
        userPhone: '',
        duration: '45',
        timeZone: 'Asia/Kolkata',
        serviceType: '',
        preparationDetails: '',
        additionalInfo: ''
      });
      setSelectedDate(null);
      setSelectedTime('');

      // Reload bookings
      await loadMyBookings();
      
      setTimeout(() => setBookingSuccess(''), 4000);
    } catch (err) {
      setBookingError(err.message || 'Failed to book meeting. Please try again.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = await currentUser.getIdToken();
      await cancelBooking(bookingId, token);
      await loadMyBookings();
    } catch (err) {
      console.error('Error canceling booking:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            {getValue('contact_title', 'Get In Touch')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('contact_subtitle', "We'd love to hear from you. Send us a message!")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-4">
                {getValue('contact_info_title', 'Contact Information')}
              </h3>
            </div>

            {[
              {
                title: 'Headquarters',
                details: ['India', 'Pan-India Support Network', 'Global Reach']
              },
              {
                title: 'Phone',
                details: ['+91-XXXX-XXXX-XXXX', 'Toll Free Support']
              },
              {
                title: 'Email',
                details: ['support@diasporanri.com', 'info@diasporanri.com']
              },
              {
                title: 'Website',
                details: ['www.diasporanri.com', '24/7 Online Support']
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <div className="space-y-1">
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-gray-300 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((social, idx) => (
                  <a key={idx} href="#" className="text-blue-300 hover:text-blue-200 transition">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-6 border-b border-blue-400/30">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 font-semibold transition border-b-2 ${
                  activeTab === 'contact'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-blue-400'
                }`}
              >
                Send Message
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={`px-6 py-3 font-semibold transition border-b-2 ${
                  activeTab === 'booking'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-blue-400'
                }`}
              >
                Book a Meeting
              </button>
            </div>

            {/* Contact Form Tab */}
            {activeTab === 'contact' && (
              <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-200 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Media Upload Section */}
              <div className="mb-6 pb-6 border-b border-blue-400/30">
                <label className="block text-sm font-semibold text-gray-200 mb-4">Attach Media (Optional)</label>
                <p className="text-xs text-gray-400 mb-4">Upload images, documents, or other files to support your inquiry</p>
                
                {mediaFile ? (
                  <div className="bg-slate-900/40 border border-blue-400/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {mediaPreview ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                            <Icon name="attachment" className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-200 truncate">{mediaFile.name}</p>
                          <p className="text-xs text-gray-400">{(mediaFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="text-red-400 hover:text-red-300 font-semibold transition"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setMediaFile(null);
                            setMediaPreview('');
                          }}
                          className="text-gray-400 hover:text-red-400 transition"
                        >
                          <Icon name="close" className="w-5 h-5" />
                        </button>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-blue-400/30 rounded-lg p-6 text-center hover:border-blue-400/60 transition cursor-pointer">
                    <input
                      type="file"
                      onChange={handleMediaChange}
                      className="hidden"
                      id="media-input"
                    />
                    <label htmlFor="media-input" className="cursor-pointer">
                      <div className="text-3xl mb-2">📤</div>
                      <p className="text-sm font-medium text-gray-200 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">Images, PDFs, Documents (Max 10MB)</p>
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg flex items-center gap-2">
                  <Icon name="check" className="w-5 h-5 flex-shrink-0" />
                  <span>Thank you! Your message{mediaFile ? ' and attachment' : ''} has been sent successfully. We'll get back to you soon.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            )}

            {/* Booking Form Tab */}
            {activeTab === 'booking' && (
              <div>
                {!currentUser ? (
                  <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg text-center">
                    <div className="mb-6">
                      <Icon name="lock" className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
                    <p className="text-gray-300 mb-6">You need to be logged in to book a meeting with our team.</p>
                    <button
                      onClick={() => navigate('/login', { state: { from: '/contact' } })}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                    >
                      Login Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg space-y-6">
                    {/* Personal Information */}
                    <div className="border-b border-blue-400/30 pb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">Your Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name *</label>
                          <input
                            type="text"
                            name="userName"
                            value={bookingData.userName}
                            onChange={handleBookingChange}
                            required
                            className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Email *</label>
                          <input
                            type="email"
                            name="userEmail"
                            value={bookingData.userEmail}
                            onChange={handleBookingChange}
                            required
                            className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="userPhone"
                          value={bookingData.userPhone}
                          onChange={handleBookingChange}
                          required
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="border-b border-blue-400/30 pb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">Select Service</h4>
                      <select
                        name="serviceType"
                        value={bookingData.serviceType}
                        onChange={handleBookingChange}
                        required
                        className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                      >
                        <option value="">Choose a service...</option>
                        {services.map((service, idx) => (
                          <option key={idx} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    {/* Meeting Details - Calendar Based */}
                    <div className="border-b border-blue-400/30 pb-6">
                      <BookingCalendar 
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onDateSelect={setSelectedDate}
                        onTimeSelect={setSelectedTime}
                        existingBookings={myBookings}
                      />
                    </div>

                    {/* Duration & Time Zone */}
                    <div className="border-b border-blue-400/30 pb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">Meeting Preferences</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Duration</label>
                          <select
                            name="duration"
                            value={bookingData.duration}
                            onChange={handleBookingChange}
                            className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                          >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-200 mb-2">Time Zone</label>
                          <select
                            name="timeZone"
                            value={bookingData.timeZone}
                            onChange={handleBookingChange}
                            className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 focus:border-blue-400 focus:outline-none transition"
                          >
                            <option value="Asia/Kolkata">India Standard Time (IST)</option>
                            <option value="UTC">UTC / GMT</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">GMT / London</option>
                            <option value="Europe/Paris">Central European Time</option>
                            <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                            <option value="Australia/Sydney">Australian Eastern Time</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Preparation */}
                    <div className="border-b border-blue-400/30 pb-6">
                      <h4 className="text-lg font-semibold text-blue-300 mb-4">Meeting Preparation</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                          Tell us about your needs *
                        </label>
                        <p className="text-xs text-gray-400 mb-3">
                          Describe your organizational challenge and consulting objectives to help us align our expertise
                        </p>
                        <textarea
                          name="preparationDetails"
                          value={bookingData.preparationDetails}
                          onChange={handleBookingChange}
                          required
                          rows="5"
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition resize-none"
                          placeholder="Please provide details about what you'd like to discuss..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">Additional Information</label>
                        <textarea
                          name="additionalInfo"
                          value={bookingData.additionalInfo}
                          onChange={handleBookingChange}
                          rows="3"
                          className="w-full bg-slate-900/60 border border-blue-400/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-400 focus:outline-none transition resize-none"
                          placeholder="Any other information you'd like to share..."
                        />
                      </div>
                    </div>

                    {bookingError && (
                      <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg flex items-center gap-2">
                        <Icon name="alert" className="w-5 h-5 flex-shrink-0" />
                        <span>{bookingError}</span>
                      </div>
                    )}

                    {bookingSuccess && (
                      <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg flex items-center gap-2">
                        <Icon name="check" className="w-5 h-5 flex-shrink-0" />
                        <span>{bookingSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
                    >
                      {bookingLoading ? 'Booking...' : 'Book Meeting'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* My Bookings Section */}
        {currentUser && activeTab === 'booking' && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Your Upcoming Meetings
            </h2>

            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-400">Loading your bookings...</div>
              </div>
            ) : myBookings.length === 0 ? (
              <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg text-center">
                <Icon name="calendar" className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <p className="text-gray-300">No meetings booked yet. Book your first meeting above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myBookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className={`rounded-lg overflow-hidden transition border ${
                      booking.status === 'confirmed' 
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-green-400/30 shadow-lg shadow-green-500/10' 
                        : 'bg-slate-800/50 border-blue-400/30 hover:border-blue-400/60'
                    }`}
                  >
                    <div className="p-6">
                      {/* Confirmed Badge Header */}
                      {booking.status === 'confirmed' && (
                        <div className="mb-4 pb-4 border-b border-green-400/30">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-green-400 font-semibold text-sm">✓ Meeting Confirmed</p>
                          </div>
                        </div>
                      )}

                      {/* Main Details */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{booking.serviceType}</h3>
                          <p className="text-sm text-gray-400">
                            📅 {new Date(booking.meetingDate).toLocaleDateString()} at {booking.meetingTime}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>

                      {/* Meeting Details */}
                      <div className="space-y-2 mb-4 text-sm text-gray-300">
                        <p><span className="text-gray-400">⏱️ Duration:</span> {booking.duration} minutes</p>
                        <p><span className="text-gray-400">🌍 Time Zone:</span> {booking.timeZone}</p>
                      </div>

                      {/* Meeting Link - Prominent when confirmed */}
                      {booking.status === 'confirmed' && booking.meetingLink ? (
                        <div className="mb-4 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                          <p className="text-xs text-green-300 font-semibold mb-2">📞 MEETING LINK</p>
                          <a 
                            href={booking.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition mb-2"
                          >
                            Join Meeting Now
                          </a>
                          <p className="text-xs text-gray-400 break-all">{booking.meetingLink}</p>
                        </div>
                      ) : booking.meetingLink ? (
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 mb-2">Meeting Link:</p>
                          <a 
                            href={booking.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm break-all"
                          >
                            {booking.meetingLink}
                          </a>
                        </div>
                      ) : null}

                      {/* Meeting Details */}
                      {booking.meetingDetails && (
                        <div className="mb-4 p-3 bg-slate-900/50 border border-blue-400/20 rounded-lg">
                          <p className="text-xs text-blue-300 font-semibold mb-2">📝 Additional Details</p>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{booking.meetingDetails}</p>
                        </div>
                      )}

                      {/* Pending Notice */}
                      {booking.status === 'pending' && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                          <p className="text-xs text-yellow-300">⏳ Your booking is pending confirmation. You'll receive an email when it's confirmed with the meeting link.</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {booking.status === 'pending' || booking.status === 'confirmed' ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full bg-red-500/20 border border-red-400/50 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Cancel Booking
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map Placeholder */}
        <div className="mt-16 bg-slate-800/50 border border-blue-400/30 rounded-lg overflow-hidden h-96">
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-300">Interactive map will be displayed here</p>
              <p className="text-gray-300 text-sm mt-2">Connect with our offices worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

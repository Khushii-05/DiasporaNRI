import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { submitContact } from '../services/contactService';
import { getPageContent, mapBlocksToValues } from '../services/contentService';

export default function Contact() {
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
  const [content, setContent] = useState({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const blocks = await getPageContent('contact');
        setContent(mapBlocksToValues(blocks));
      } catch (error) {
        // Use fallback text when content API is unavailable
      }
    };

    loadContent();
  }, []);

  const getValue = (key, fallback) => content[key] || fallback;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
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
              <h3 className="text-xl font-bold text-blue-400 mb-4">
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
                    <p key={i} className="text-gray-400 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((social, idx) => (
                  <a key={idx} href="#" className="text-blue-400 hover:text-cyan-400 transition">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-700/50 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-slate-700/50 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Media Upload Section */}
              <div className="mb-6 pb-6 border-b border-blue-400/20">
                <label className="block text-sm font-semibold text-gray-300 mb-4">Attach Media (Optional)</label>
                <p className="text-xs text-gray-400 mb-4">Upload images, documents, or other files to support your inquiry</p>
                
                {mediaFile ? (
                  <div className="bg-slate-700/30 border border-blue-400/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {mediaPreview ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                            <Icon name="attachment" className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white truncate">{mediaFile.name}</p>
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
                      <p className="text-sm font-medium text-gray-300 mb-1">Click to upload or drag and drop</p>
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
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16 bg-slate-800/50 border border-blue-400/30 rounded-lg overflow-hidden h-96">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Interactive map will be displayed here</p>
              <p className="text-gray-500 text-sm mt-2">Connect with our offices worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

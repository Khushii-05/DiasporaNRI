import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import DefaultProfilePicture from '../components/DefaultProfilePicture';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile picture fields
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureFileName, setProfilePictureFileName] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureError, setPictureError] = useState('');
  const [pictureSuccess, setPictureSuccess] = useState('');
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Delete account fields
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setDisplayName(currentUser.displayName || '');
    setEmail(currentUser.email || '');

    // Load profile data from Firestore
    const loadProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.profilePicture) setProfilePicture(data.profilePicture);
          if (data.profilePictureFileName) setProfilePictureFileName(data.profilePictureFileName);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [currentUser, navigate]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPictureError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPictureError('Please select a valid image file');
      return;
    }

    setProfilePictureFile(file);
    setPictureError('');

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicturePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePictureFile) {
      setPictureError('Please select a file first');
      return;
    }

    setUploadingPicture(true);
    setPictureError('');
    setPictureSuccess('');

    try {
      const token = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('profilePicture', profilePictureFile);

      const response = await fetch('http://localhost:4000/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      // Save URL and fileName to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        profilePicture: data.url,
        profilePictureFileName: data.fileName,
        updatedAt: new Date()
      }, { merge: true });

      // Update profile in Firebase Auth
      await updateProfile(currentUser, {
        photoURL: data.url
      });

      setProfilePicture(data.url);
      setProfilePictureFileName(data.fileName);
      setProfilePictureFile(null);
      setProfilePicturePreview('');
      setPictureSuccess('Profile picture updated successfully!');
      setTimeout(() => setPictureSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setPictureError('Error uploading profile picture: ' + error.message);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Delete your profile picture?')) return;

    setUploadingPicture(true);
    setPictureError('');
    setPictureSuccess('');

    try {
      if (!profilePictureFileName) {
        setPictureError('No picture to delete');
        setUploadingPicture(false);
        return;
      }

      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:4000/profile/picture/${encodeURIComponent(profilePictureFileName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      // Remove from Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        profilePicture: '',
        profilePictureFileName: '',
        updatedAt: new Date()
      }, { merge: true });

      // Remove from Firebase Auth
      await updateProfile(currentUser, {
        photoURL: null
      });

      setProfilePicture('');
      setProfilePictureFileName('');
      setProfilePictureFile(null);
      setProfilePicturePreview('');
      setPictureSuccess('Profile picture deleted successfully!');
      setTimeout(() => setPictureSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      setPictureError('Error deleting profile picture: ' + error.message);
    } finally {
      setUploadingPicture(false);
    }
  };



  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: displayName
      });

      // Save to Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName,
        email: email,
        updatedAt: new Date()
      }, { merge: true });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setLoadingPassword(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('New password is too weak');
      } else {
        setPasswordError('Error updating password: ' + error.message);
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };



  const handleDeleteAccount = async () => {
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError('Password is required to delete your account');
      return;
    }

    setLoadingDelete(true);

    try {
      // Re-authenticate user with password
      const credential = EmailAuthProvider.credential(currentUser.email, deletePassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Delete profile picture from R2 if it exists
      if (profilePictureFileName) {
        try {
          const token = await currentUser.getIdToken();
          await fetch(`http://localhost:4000/profile/picture/${encodeURIComponent(profilePictureFileName)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (storageError) {
          // File might not exist, that's okay
          console.log('Profile picture not found or already deleted');
        }
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid));

      // Delete user account from Firebase Authentication
      await deleteUser(currentUser);

      // Clear success modal and redirect
      setDeletePassword('');
      setShowDeleteModal(false);
      await logout();
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setDeleteError('Password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        setDeleteError('Please log in again before deleting your account');
      } else {
        setDeleteError('Error deleting account: ' + error.message);
      }
    } finally {
      setLoadingDelete(false);
    }
  };



  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mb-8">Update your account details and profile picture</p>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-400/30 text-green-400 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="bg-slate-700/30 border border-blue-400/20 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Picture Display */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden border-2 border-blue-400/30 mb-4">
                  {profilePicturePreview ? (
                    <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <DefaultProfilePicture className="w-20 h-20 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-400 text-center">
                  {profilePicture ? 'Current profile picture' : 'No profile picture yet'}
                </p>
              </div>

              {/* Profile Picture Upload */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Icon name="upload" className="w-5 h-5" />
                  Profile Picture
                </h3>

                {pictureError && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
                    {pictureError}
                  </div>
                )}

                {pictureSuccess && (
                  <div className="bg-green-500/20 border border-green-400/30 text-green-400 p-3 rounded-lg mb-4 text-sm">
                    {pictureSuccess}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Choose Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 cursor-pointer"
                    />
                    <p className="text-gray-400 text-xs mt-1">Max 5MB. JPG, PNG, or GIF</p>
                  </div>

                  {profilePictureFile && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleUploadProfilePicture}
                        disabled={uploadingPicture}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Icon name="upload" className="w-4 h-4" />
                        {uploadingPicture ? 'Uploading...' : 'Upload'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePictureFile(null);
                          setProfilePicturePreview('');
                          setPictureError('');
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {profilePicture && !profilePictureFile && (
                    <button
                      type="button"
                      onClick={handleDeleteProfilePicture}
                      disabled={uploadingPicture}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Icon name="delete" className="w-4 h-4" />
                      {uploadingPicture ? 'Deleting...' : 'Delete Picture'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-slate-900 border border-slate-700 text-gray-500 rounded-lg px-4 py-2 cursor-not-allowed"
              />
              <p className="text-gray-400 text-sm mt-2">Email cannot be changed</p>
            </div>

            {/* UID (Display only) */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Account ID</label>
              <input
                type="text"
                value={currentUser.uid}
                disabled
                className="w-full bg-slate-900 border border-slate-700 text-gray-500 rounded-lg px-4 py-2 cursor-not-allowed text-sm"
              />
            </div>

            {/* Save Changes Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 text-lg flex items-center justify-center gap-2"
            >
              <Icon name="save" className="w-6 h-6" />
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>

          {/* Account Created Info */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-gray-400 text-sm">
              Account created: {currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Change Password</h2>
          <p className="text-gray-400 mb-6">Update your password. You must provide your current password for security.</p>

          {passwordError && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/20 border border-green-400/30 text-green-400 p-4 rounded-lg mb-6">
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            <p className="text-gray-400 text-sm">Password must be at least 6 characters long</p>

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loadingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-4">
            Forgot your password?{' '}
            <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition">
              Use the password reset link on the login page
            </a>
          </p>
        </div>

        {/* Logout Button */}
        <div className="bg-slate-800/50 border border-red-400/30 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Logout</h2>
          <p className="text-gray-400 mb-6">Sign out of your account and return to the home page</p>
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="bg-slate-800/50 border border-red-500/50 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Delete Account</h2>
          <p className="text-gray-400 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 rounded-lg transition border border-red-500/30"
          >
            Delete Account Permanently
          </button>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-red-400/50 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Delete Account?</h3>
              <p className="text-gray-300 mb-6">
                This will permanently delete your account, profile picture, and all associated data. This action cannot be undone.
              </p>

              {deleteError && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
                  {deleteError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Confirm with your password:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-red-400 focus:outline-none transition"
                  disabled={loadingDelete}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  disabled={loadingDelete}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loadingDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loadingDelete ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

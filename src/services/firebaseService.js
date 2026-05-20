import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ==================== MEDIA OPERATIONS ====================

export const addMedia = async (mediaData, file) => {
  try {
    let fileUrl = '';
    
    // Upload file to storage if provided
    if (file) {
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);
    }

    // Add media document to Firestore
    const docRef = await addDoc(collection(db, 'media'), {
      ...mediaData,
      fileUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { id: docRef.id, ...mediaData, fileUrl };
  } catch (error) {
    console.error('Error adding media:', error);
    throw error;
  }
};

export const getMedia = async () => {
  try {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const media = [];
    querySnapshot.forEach((doc) => {
      media.push({ id: doc.id, ...doc.data() });
    });
    return media;
  } catch (error) {
    console.error('Error getting media:', error);
    throw error;
  }
};

export const updateMedia = async (mediaId, mediaData) => {
  try {
    const mediaRef = doc(db, 'media', mediaId);
    await updateDoc(mediaRef, {
      ...mediaData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating media:', error);
    throw error;
  }
};

export const deleteMedia = async (mediaId, fileUrl) => {
  try {
    // Delete file from storage if it exists
    if (fileUrl) {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    }

    // Delete document from Firestore
    await deleteDoc(doc(db, 'media', mediaId));
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};

// ==================== ACHIEVEMENTS OPERATIONS ====================

export const addAchievement = async (achievementData, file) => {
  try {
    let fileUrl = '';
    
    // Upload file to storage if provided
    if (file) {
      const storageRef = ref(storage, `achievements/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(snapshot.ref);
    }

    // Add achievement document to Firestore
    const docRef = await addDoc(collection(db, 'achievements'), {
      ...achievementData,
      fileUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { id: docRef.id, ...achievementData, fileUrl };
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

export const getAchievements = async () => {
  try {
    const q = query(collection(db, 'achievements'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const achievements = [];
    querySnapshot.forEach((doc) => {
      achievements.push({ id: doc.id, ...doc.data() });
    });
    return achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    throw error;
  }
};

export const updateAchievement = async (achievementId, achievementData) => {
  try {
    const achievementRef = doc(db, 'achievements', achievementId);
    await updateDoc(achievementRef, {
      ...achievementData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

export const deleteAchievement = async (achievementId, fileUrl) => {
  try {
    // Delete file from storage if it exists
    if (fileUrl) {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    }

    // Delete document from Firestore
    await deleteDoc(doc(db, 'achievements', achievementId));
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};

// ==================== CONTACT SUBMISSIONS ====================

export const addContactSubmission = async (submissionData) => {
  try {
    const docRef = await addDoc(collection(db, 'contact_submissions'), {
      ...submissionData,
      createdAt: new Date(),
      read: false
    });
    return { id: docRef.id, ...submissionData };
  } catch (error) {
    console.error('Error adding contact submission:', error);
    throw error;
  }
};

export const getContactSubmissions = async () => {
  try {
    const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return submissions;
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    throw error;
  }
};

export const markSubmissionAsRead = async (submissionId, isRead) => {
  try {
    const submissionRef = doc(db, 'contact_submissions', submissionId);
    await updateDoc(submissionRef, {
      read: isRead
    });
  } catch (error) {
    console.error('Error marking submission as read:', error);
    throw error;
  }
};

export const deleteContactSubmission = async (submissionId) => {
  try {
    await deleteDoc(doc(db, 'contact_submissions', submissionId));
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    throw error;
  }
};

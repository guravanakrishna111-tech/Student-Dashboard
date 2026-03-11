import { db, auth } from './firebaseconfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Get current user ID
export const getCurrentUserId = () => {
  return auth.currentUser?.uid;
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ========== TASKS ==========

// Save/Update tasks
export const saveTasks = async (userId, tasks) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'data', 'tasks');
    await setDoc(userRef, { tasks, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

// Get tasks for user
export const getTasks = async (userId) => {
  try {
    if (!userId) return [];
    const userRef = doc(db, 'users', userId, 'data', 'tasks');
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data().tasks || [] : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

// Real-time listener for tasks
export const onTasksChange = (userId, callback) => {
  if (!userId) return () => {};
  const userRef = doc(db, 'users', userId, 'data', 'tasks');
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().tasks || []);
    } else {
      callback([]);
    }
  });
};

// ========== CALCULATION HISTORY ==========

// Save calculation
export const saveCalculation = async (userId, calculation) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'data', 'calculations');
    await updateDoc(userRef, {
      history: arrayUnion(calculation),
      updatedAt: new Date()
    }).catch(() => {
      setDoc(userRef, { history: [calculation], updatedAt: new Date() });
    });
    return true;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw error;
  }
};

// Get calculation history
export const getCalculationHistory = async (userId) => {
  try {
    if (!userId) return [];
    const userRef = doc(db, 'users', userId, 'data', 'calculations');
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data().history || [] : [];
  } catch (error) {
    console.error('Error getting calculation history:', error);
    return [];
  }
};

// Clear calculation history
export const clearCalculationHistory = async (userId) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'data', 'calculations');
    await setDoc(userRef, { history: [], updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error clearing calculation history:', error);
    throw error;
  }
};

// Delete calculation
export const deleteCalculation = async (userId, calculation) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'data', 'calculations');
    await updateDoc(userRef, {
      history: arrayRemove(calculation),
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
};

// Real-time listener for calculations
export const onCalculationsChange = (userId, callback) => {
  if (!userId) return () => {};
  const userRef = doc(db, 'users', userId, 'data', 'calculations');
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().history || []);
    } else {
      callback([]);
    }
  });
};

// ========== PROFILE ==========

// Save profile
export const saveProfile = async (userId, profile) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'profile');
    await setDoc(userRef, { ...profile, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Get profile
export const getProfile = async (userId) => {
  try {
    if (!userId) return {};
    const userRef = doc(db, 'users', userId, 'profile');
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (error) {
    console.error('Error getting profile:', error);
    return {};
  }
};

// Real-time listener for profile
export const onProfileChange = (userId, callback) => {
  if (!userId) return () => {};
  const userRef = doc(db, 'users', userId, 'profile');
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({});
    }
  });
};

// ========== SETTINGS ==========

// Save settings
export const saveSettings = async (userId, settings) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'settings');
    await setDoc(userRef, { ...settings, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// Get settings
export const getSettings = async (userId) => {
  try {
    if (!userId) return {};
    const userRef = doc(db, 'users', userId, 'settings');
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

// Real-time listener for settings
export const onSettingsChange = (userId, callback) => {
  if (!userId) return () => {};
  const userRef = doc(db, 'users', userId, 'settings');
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({});
    }
  });
};

// ========== STREAK ==========

// Save streak data
export const saveStreak = async (userId, streak, lastDate) => {
  try {
    if (!userId) return;
    const userRef = doc(db, 'users', userId, 'data', 'streak');
    await setDoc(userRef, { streak, lastDate, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving streak:', error);
    throw error;
  }
};

// Get streak data
export const getStreak = async (userId) => {
  try {
    if (!userId) return { streak: 0, lastDate: null };
    const userRef = doc(db, 'users', userId, 'data', 'streak');
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return { streak: 0, lastDate: null };
  } catch (error) {
    console.error('Error getting streak:', error);
    return { streak: 0, lastDate: null };
  }
};

// Real-time listener for streak
export const onStreakChange = (userId, callback) => {
  if (!userId) return () => {};
  const userRef = doc(db, 'users', userId, 'data', 'streak');
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ streak: 0, lastDate: null });
    }
  });
};

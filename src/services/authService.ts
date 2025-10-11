import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserData {
  email: string;
  createdAt: any;
  lastLogin: any;
}

// Check if user exists in Firestore
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'itm', email));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Create new user in Authentication and Firestore
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore 'itm' collection
    const userData: UserData = {
      email: email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await setDoc(doc(db, 'itm', email), userData);
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in existing user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login time
    await setDoc(doc(db, 'itm', email), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Sign out user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (email: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'itm', email));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Interfaces for different post types
export interface GlobalPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
}

export interface ClassPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
}

export interface Discussion {
  id?: string;
  topic: string;
  createdBy: string;
  createdAt: any;
}

export interface News {
  id?: string;
  title: string;
  summary: string;
  createdAt: any;
}

// Global Posts Functions
export const createGlobalPost = async (postData: Omit<GlobalPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const post: Omit<GlobalPost, 'id'> = {
      ...postData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'itm', 'global_posts'), post);
    return docRef.id;
  } catch (error) {
    console.error('Error creating global post:', error);
    throw error;
  }
};

export const getGlobalPosts = async (limitCount: number = 20): Promise<GlobalPost[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'global_posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GlobalPost));
  } catch (error) {
    console.error('Error getting global posts:', error);
    throw error;
  }
};

export const getGlobalPost = async (postId: string): Promise<GlobalPost | null> => {
  try {
    const docRef = doc(db, 'itm', 'global_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as GlobalPost;
    }
    return null;
  } catch (error) {
    console.error('Error getting global post:', error);
    throw error;
  }
};

// Available class names
export const CLASS_NAMES = [
  'sam altman',
  'larry page', 
  'demis hassibis',
  'jeff bezos'
] as const;

export type ClassName = typeof CLASS_NAMES[number];

// Class Posts Functions
export const createClassPost = async (className: string, postData: Omit<ClassPost, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const post: Omit<ClassPost, 'id'> = {
      ...postData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'itm', 'class_posts', className), post);
    return docRef.id;
  } catch (error) {
    console.error('Error creating class post:', error);
    throw error;
  }
};

export const getClassPosts = async (className: string, limitCount: number = 20): Promise<ClassPost[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'class_posts', className),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ClassPost));
  } catch (error) {
    console.error('Error getting class posts:', error);
    throw error;
  }
};

export const getClassPost = async (className: string, postId: string): Promise<ClassPost | null> => {
  try {
    const docRef = doc(db, 'itm', 'class_posts', className, postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ClassPost;
    }
    return null;
  } catch (error) {
    console.error('Error getting class post:', error);
    throw error;
  }
};

// Discussion Functions
export const createDiscussion = async (discussionData: Omit<Discussion, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const discussion: Omit<Discussion, 'id'> = {
      ...discussionData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'itm', 'data', 'discussions'), discussion);
    return docRef.id;
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
};

export const getDiscussions = async (limitCount: number = 20): Promise<Discussion[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'discussions'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Discussion));
  } catch (error) {
    console.error('Error getting discussions:', error);
    throw error;
  }
};

export const getDiscussion = async (discussionId: string): Promise<Discussion | null> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'discussions', discussionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Discussion;
    }
    return null;
  } catch (error) {
    console.error('Error getting discussion:', error);
    throw error;
  }
};

// News Functions
export const createNews = async (newsData: Omit<News, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const news: Omit<News, 'id'> = {
      ...newsData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'itm', 'data', 'news'), news);
    return docRef.id;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const getNews = async (limitCount: number = 20): Promise<News[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'news'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

export const getNewsItem = async (newsId: string): Promise<News | null> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'news', newsId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as News;
    }
    return null;
  } catch (error) {
    console.error('Error getting news item:', error);
    throw error;
  }
};

// Update Functions
export const updateGlobalPost = async (postId: string, updates: Partial<GlobalPost>): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'global_posts', postId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating global post:', error);
    throw error;
  }
};

export const updateClassPost = async (className: string, postId: string, updates: Partial<ClassPost>): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'class_posts', className, postId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating class post:', error);
    throw error;
  }
};

export const updateDiscussion = async (discussionId: string, updates: Partial<Discussion>): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'discussions', discussionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating discussion:', error);
    throw error;
  }
};

export const updateNews = async (newsId: string, updates: Partial<News>): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'news', newsId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

// Delete Functions
export const deleteGlobalPost = async (postId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'global_posts', postId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting global post:', error);
    throw error;
  }
};

export const deleteClassPost = async (className: string, postId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'class_posts', className, postId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting class post:', error);
    throw error;
  }
};

export const deleteDiscussion = async (discussionId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'discussions', discussionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting discussion:', error);
    throw error;
  }
};

export const deleteNews = async (newsId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'itm', 'data', 'news', newsId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

// Get user's discussions
export const getUserDiscussions = async (userEmail: string): Promise<Discussion[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'discussions'),
      where('createdBy', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Discussion));
  } catch (error) {
    console.error('Error getting user discussions:', error);
    throw error;
  }
};

// Get user's news
export const getUserNews = async (userEmail: string): Promise<News[]> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'news'),
      where('createdBy', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  } catch (error) {
    console.error('Error getting user news:', error);
    throw error;
  }
};

// Helper functions for specific classes
export const getSamAltmanPosts = async (limitCount: number = 200): Promise<ClassPost[]> => {
  return getClassPosts('sam altman', limitCount);
};

export const getLarryPagePosts = async (limitCount: number = 200): Promise<ClassPost[]> => {
  return getClassPosts('larry page', limitCount);
};

export const getDemisHassibisPosts = async (limitCount: number = 200): Promise<ClassPost[]> => {
  return getClassPosts('demis hassibis', limitCount);
};

export const getJeffBezosPosts = async (limitCount: number = 200): Promise<ClassPost[]> => {
  return getClassPosts('jeff bezos', limitCount);
};

// Get all posts from all classes
export const getAllClassPosts = async (limitPerClass: number = 100): Promise<{className: string, posts: ClassPost[]}[]> => {
  try {
    const allClassPosts = await Promise.all(
      CLASS_NAMES.map(async (className) => ({
        className,
        posts: await getClassPosts(className, limitPerClass)
      }))
    );
    return allClassPosts;
  } catch (error) {
    console.error('Error getting all class posts:', error);
    throw error;
  }
};
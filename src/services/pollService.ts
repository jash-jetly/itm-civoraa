import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { sanitizeInput } from '../utils/security';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id?: string;
  title: string;
  description?: string;
  options: PollOption[];
  authorEmail: string;
  authorName?: string;
  authorTag: string;
  addressShort: string;
  isAnonymous: boolean;
  visibility: 'global' | 'class';
  classId?: number;
  className?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comments: number;
  totalVotes: number;
  type: 'poll' | 'discussion' | 'issue';
  votedUsers: string[]; // Array of user emails who have voted
}

export interface CreatePollData {
  title: string;
  description?: string;
  options?: string[];
  authorEmail: string;
  isAnonymous: boolean;
  visibility: 'global' | 'class';
  classId?: number;
  className?: string;
  tags?: string;
  type: 'poll' | 'discussion' | 'issue';
}

// Generate a random author tag for anonymous posts
const generateAuthorTag = (): string => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate a short address for display
const generateAddressShort = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Function to parse username from email format like "2025.jashj@isu.ac.in"
const parseUsername = (email: string): string => {
  if (!email) return 'Anonymous';
  
  try {
    // Split email by @ to get the local part
    const localPart = email.split('@')[0];
    
    // Split by . to separate year and username
    const parts = localPart.split('.');
    
    if (parts.length >= 2) {
      // Get the username part (everything after the first dot)
      const usernamePart = parts.slice(1).join('.');
      
      // Insert space before capital letters and format properly
      const formattedUsername = usernamePart
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return formattedUsername;
    }
    
    // Fallback: use the whole local part
    return localPart;
  } catch (error) {
    return 'Anonymous';
  }
};

// Create a new poll
export const createPoll = async (pollData: CreatePollData): Promise<{ success: boolean; pollId?: string; error?: string }> => {
  try {
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(pollData.title);
    const sanitizedDescription = pollData.description ? sanitizeInput(pollData.description) : '';
    
    if (!sanitizedTitle.trim()) {
      return { success: false, error: 'Title is required' };
    }

    // Process poll options for polls
    let processedOptions: PollOption[] = [];
    if (pollData.type === 'poll' && pollData.options) {
      processedOptions = pollData.options
        .filter(option => option.trim())
        .map((option, index) => ({
          id: `opt${index + 1}`,
          text: sanitizeInput(option),
          votes: 0
        }));

      if (processedOptions.length < 2) {
        return { success: false, error: 'At least 2 poll options are required' };
      }
    }

    // Process tags
    const processedTags = pollData.tags 
      ? pollData.tags.split(',').map(tag => sanitizeInput(tag.trim())).filter(tag => tag)
      : [];

    // Create poll object
    const poll: any = {
      title: sanitizedTitle,
      options: processedOptions,
      authorEmail: pollData.isAnonymous ? 'anonymous' : pollData.authorEmail,
      authorTag: generateAuthorTag(),
      addressShort: generateAddressShort(),
      isAnonymous: pollData.isAnonymous,
      visibility: pollData.visibility,
      tags: processedTags,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      comments: 0,
      totalVotes: 0,
      type: pollData.type,
      votedUsers: [] // Initialize empty array for tracking voters
    };

    // Add authorName for non-anonymous polls
    if (!pollData.isAnonymous) {
      poll.authorName = parseUsername(pollData.authorEmail);
    }

    // Only add optional fields if they have values
    if (sanitizedDescription && sanitizedDescription.trim()) {
      poll.description = sanitizedDescription;
    }
    if (pollData.classId !== undefined && pollData.classId !== null) {
      poll.classId = pollData.classId;
    }
    if (pollData.className !== undefined && pollData.className !== null) {
      poll.className = pollData.className;
    }

    // Add to Firestore under itm collection
    if (pollData.visibility === 'global') {
      const docRef = await addDoc(collection(db, 'itm', 'data', 'global_polls'), poll);
      return { success: true, pollId: docRef.id };
    } else {
      const docRef = await addDoc(collection(db, 'itm', 'data', 'class_polls'), poll);
      return { success: true, pollId: docRef.id };
    }
  } catch (error) {
    console.error('Error creating poll:', error);
    return { success: false, error: 'Failed to create poll. Please try again.' };
  }
};

// Get global polls
export const getGlobalPolls = async (): Promise<{ success: boolean; polls?: Poll[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'global_polls'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];
    
    querySnapshot.forEach((doc) => {
      const pollData = doc.data();
      polls.push({
        id: doc.id,
        ...pollData,
        // Ensure votedUsers array exists for older polls
        votedUsers: pollData.votedUsers || []
      } as Poll);
    });
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching global polls:', error);
    return { success: false, error: 'Failed to fetch polls' };
  }
};

// Get class-specific polls
export const getClassPolls = async (classId: number): Promise<{ success: boolean; polls?: Poll[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'class_polls'),
      where('classId', '==', classId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];
    
    querySnapshot.forEach((doc) => {
      const pollData = doc.data();
      polls.push({
        id: doc.id,
        ...pollData,
        // Ensure votedUsers array exists for older polls
        votedUsers: pollData.votedUsers || []
      } as Poll);
    });
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching class polls:', error);
    return { success: false, error: 'Failed to fetch class polls' };
  }
};

// Get all class polls (for InClass page)
export const getAllClassPolls = async (): Promise<{ success: boolean; polls?: Poll[]; error?: string }> => {
  try {
    const q = query(
      collection(db, 'itm', 'data', 'class_polls'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const polls: Poll[] = [];
    
    querySnapshot.forEach((doc) => {
      const pollData = doc.data();
      polls.push({
        id: doc.id,
        ...pollData,
        // Ensure votedUsers array exists for older polls
        votedUsers: pollData.votedUsers || []
      } as Poll);
    });
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching all class polls:', error);
    return { success: false, error: 'Failed to fetch class polls' };
  }
};

// Vote on a poll
export const voteOnPoll = async (pollId: string, optionId: string, visibility: 'global' | 'class', userEmail: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const collectionName = visibility === 'global' ? 'global_polls' : 'class_polls';
    const pollRef = doc(db, 'itm', 'data', collectionName, pollId);
    
    // Get current poll data
    const pollDoc = await getDoc(pollRef);
    if (!pollDoc.exists()) {
      return { success: false, error: 'Poll not found' };
    }
    
    const pollData = pollDoc.data() as Poll;
    
    // Check if user has already voted
    if (pollData.votedUsers && pollData.votedUsers.includes(userEmail)) {
      return { success: false, error: 'You have already voted on this poll' };
    }
    
    // Update the specific option's vote count
    const updatedOptions = pollData.options.map(option => {
      if (option.id === optionId) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });
    
    // Calculate new total votes
    const newTotalVotes = updatedOptions.reduce((total, option) => total + option.votes, 0);
    
    // Add user to votedUsers array
    const updatedVotedUsers = [...(pollData.votedUsers || []), userEmail];
    
    // Update the poll document
    await updateDoc(pollRef, {
      options: updatedOptions,
      totalVotes: newTotalVotes,
      votedUsers: updatedVotedUsers,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error voting on poll:', error);
    return { success: false, error: 'Failed to submit vote' };
  }
};

// Get user's created polls
export const getUserPolls = async (userEmail: string): Promise<{ success: boolean; polls?: Poll[]; error?: string }> => {
  try {
    // Get global polls by user
    const globalQuery = query(
      collection(db, 'itm', 'data', 'global_polls'),
      where('authorEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    // Get class polls by user
    const classQuery = query(
      collection(db, 'itm', 'data', 'class_polls'),
      where('authorEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    const [globalSnapshot, classSnapshot] = await Promise.all([
      getDocs(globalQuery),
      getDocs(classQuery)
    ]);
    
    const polls: Poll[] = [];
    
    globalSnapshot.forEach((doc) => {
      const pollData = doc.data();
      polls.push({
        id: doc.id,
        ...pollData,
        // Ensure votedUsers array exists for older polls
        votedUsers: pollData.votedUsers || []
      } as Poll);
    });
    
    classSnapshot.forEach((doc) => {
      const pollData = doc.data();
      polls.push({
        id: doc.id,
        ...pollData,
        // Ensure votedUsers array exists for older polls
        votedUsers: pollData.votedUsers || []
      } as Poll);
    });
    
    // Sort by creation date (newest first)
    polls.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    
    return { success: true, polls };
  } catch (error) {
    console.error('Error fetching user polls:', error);
    return { success: false, error: 'Failed to fetch user polls' };
  }
};
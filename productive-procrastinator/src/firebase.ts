import { initializeApp } from '@firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  UserCredential
} from '@firebase/auth';
import { FirebaseStorage, getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
console.log('Firebase imports loaded');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Type definitions
interface AuthResponse {
  user: UserCredential['user'] | null;
  error: Error | null;
}

console.log('Checking Firestore initialization...');
try {
  const testDoc = await addDoc(collection(db, 'test'), {
    test: 'test'
  });
  console.log('Firestore is working, test document created:', testDoc.id);
} catch (error) {
  console.error('Firestore initialization error:', error);
}

// Function to create a profile
export const createProfile = async (username: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const profileData = {
      profileId: user.uid,
      username: username,
      points: 0,
      streak: 0
    };

    const docRef = await addDoc(collection(db, 'profiles'), profileData);
    console.log('Profile created with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

const handleCreateTask = async () => {
  console.log('Starting to create task...'); // Add this
  try {
    const taskData = {
      name: 'Test Task',
      importance: 'high',
      urgency: 'medium',
      difficulty: 'low'
    };
    console.log('Task data:', taskData);
    const result = await createTask(taskData);
    console.log('Task creation result:', result);
  } catch (error) {
    console.error('Failed to create task:', error);
  }
};
// Authentication functions
export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

// Add this to your firebase.ts
export const testStorageUpload = async (file: File | Blob) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const storageRef = ref(storage, `test/${Date.now()}-test.jpg`);
    console.log('Starting upload...');
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload complete:', downloadURL);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Test upload failed:', error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const logOut = async (): Promise<{ error: Error | null }> => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

// Test function
// In firebase.ts
export const testFirestore = async () => {
  // Wait for auth to be ready
  console.log('Waiting for auth...');
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      }
    });
  });
  
  console.log('Auth ready, testing Firestore connection...');
  try {
    const testData = {
      name: 'Test Task',
      importance: 'high',
      urgency: 'medium',
      difficulty: 'low',
      imageUrl: ''
    };
    console.log('Attempting to create task with:', testData);
    const result = await createTask(testData);
    console.log('Task created successfully:', result);
    return result;
  } catch (error) {
    console.error('Firestore test failed:', error);
    throw error;
  }
};

// Run test immediately
testFirestore().then(() => {
  console.log('Test complete');
}).catch(error => {
  console.error('Test failed:', error);
});

export const getCurrentUser = () => {
  return auth.currentUser;
};

// New function to store image URL in Firestore
export const storeImageData = async (taskId: string, imageUrl: string) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const docRef = await addDoc(collection(db, 'taskImages'), {
      taskId,
      imageUrl,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
    
    return { docRef, error: null };
  } catch (error) {
    return { docRef: null, error: error as Error };
  }

  
};

export const createTask = async (taskData: {
  name: string;
  importance: string;
  urgency: string;
  difficulty: string;
  imageUrl?: string;
}) => {
  console.log('1. Function called with data:', taskData); // First log

  try {
    const user = auth.currentUser;
    console.log('2. Current user:', user); // Second log

    if (!user) {
      console.log('3a. No user found!'); // Error case
      throw new Error('No user logged in');
    }

    console.log('3b. User found:', user.email); // Success case

    const task = {
      ...taskData,
      profileId: user.uid,
      createdAt: new Date(),
    };
    console.log('4. Formatted task data:', task); // Fourth log

    const docRef = await addDoc(collection(db, 'tasks'), task);
    console.log('5. Task created with ID:', docRef.id); // Fifth log
    return docRef;
  } catch (error) {
    console.log('X. Error occurred:', error); // Error log
    throw error;
  }
};
// Removed the incorrect ref function implementation

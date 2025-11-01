import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

// Note: This is a client-side only file.
function initializeFirebase() {
  if (getApps().length) {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  }
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  return { app, auth, firestore };
}

export {
  initializeFirebase,
  useCollection,
  useDoc
};

export { 
    FirebaseProvider, 
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useAuth,
 } from './provider';

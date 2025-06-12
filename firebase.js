// Import Firebase funkcí
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

// Použití environmentálních proměnných v Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializace Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

//
// 🔁 REAL-TIME LISTENERY
//

// Načítání uživatelů v reálném čase
export const subscribeToUsers = (callback) => {
  const usersRef = collection(db, 'randomatorUsers');
  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Loaded users:', users);
    callback(users);
  });
};

// Načítání skupin v reálném čase
export const getGroupsFromRandomatorFirebase = (callback) => {
  const groupsRef = collection(db, 'randomatorGroups');
  return onSnapshot(groupsRef, (snapshot) => {
    const groups = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Loaded groups from Firestore:', groups);
    callback(groups);
  });
};

//
// ➕ UŽIVATELÉ
//

export const addUserToRandomatorFirebase = async (nickname) => {
  try {
    await addDoc(collection(db, 'randomatorUsers'), {
      nickname,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('Error adding user: ', e);
  }
};

export const getUsersFromRandomatorFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, 'randomatorUsers'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteUserFromFirebase = async (id) => {
  try {
    const userRef = doc(db, 'randomatorUsers', id);
    await deleteDoc(userRef);
  } catch (e) {
    console.error('Error deleting user: ', e);
  }
};

//
// 💾 SKUPINY
//

export const saveGroupsToRandomatorFirebase = async (groups) => {
  try {
    const groupsRef = collection(db, 'randomatorGroups');

    // 🧹 Smažeme všechny existující skupiny
    const snapshot = await getDocs(groupsRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // ✅ Uložíme nové skupiny s vlastním groupId jako ID dokumentu
    const savePromises = groups.map(async (group) => {
      if (
        !group.groupId ||
        !Array.isArray(group.users)
      ) return;

      const groupDocRef = doc(groupsRef, String(group.groupId));
      await setDoc(groupDocRef, {
        groupId: group.groupId,
        users: group.users,
        createdAt: serverTimestamp(),
      });
    });

    await Promise.all(savePromises);
    console.log('Groups saved successfully.');
  } catch (e) {
    console.error('Error saving groups: ', e);
  }
};
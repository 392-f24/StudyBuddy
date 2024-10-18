// General Firestore functions (shared utilities)
import { db } from '@utils/firebaseConfig';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';

// Caches for Firestore data
const usersCache = new Map();
const majorsCache = { data: null, timestamp: 0 };
const coursesCache = { data: new Set(), timestamp: 0 };
// Cache time-to-live (TTL) of 5 days
const cacheTTL = 5 * 24 * 3600 * 1000;

// Get all users from Firestore with caching and real-time updates
export const getAllUsers = async () => {
  if (usersCache.size > 0) {
    return Array.from(usersCache.values());
  }

  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);

    usersSnapshot.docs.forEach((doc) => {
      usersCache.set(doc.id, doc.data()); // Cache the user data
    });

    // Set up real-time listener to update cache
    onSnapshot(usersCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          usersCache.set(change.doc.id, change.doc.data());
        } else if (change.type === 'removed') {
          usersCache.delete(change.doc.id);
        }
      });
    });

    return Array.from(usersCache.values());
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
};

// Get list of majors from Firestore with caching and real-time updates
export const getMajors = async () => {
  const now = Date.now();
  if (majorsCache.data && now - majorsCache.timestamp < cacheTTL) {
    return majorsCache.data;
  }

  try {
    const majorsDocRef = doc(collection(db, 'majorsCourses'), 'majors');
    const majorsSnapshot = await getDoc(majorsDocRef);
    if (majorsSnapshot.exists()) {
      const majorsData = majorsSnapshot.data().majors;
      majorsCache.data = majorsData;
      majorsCache.timestamp = now;

      // Set up real-time listener to update cache
      onSnapshot(majorsDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          majorsCache.data = docSnapshot.data().majors;
          majorsCache.timestamp = Date.now();
        }
      });

      return majorsData;
    }
    return [];
  } catch (error) {
    console.error('Error fetching majors:', error);
    return [];
  }
};

// Get list of courses from Firestore and store them as a Set with caching and real-time updates
export const getCourses = async () => {
  const now = Date.now();
  if (coursesCache.data.size > 0 && now - coursesCache.timestamp < cacheTTL) {
    return Array.from(coursesCache.data);
  }

  try {
    const coursesCollectionRef = collection(db, 'courseData');
    const coursesSnapshot = await getDocs(coursesCollectionRef);

    coursesSnapshot.docs.forEach((doc) => {
      const subject = doc.id;
      const numbers = doc.data().numbers || [];
      numbers.forEach((courseNumber) => {
        coursesCache.data.add(`${subject} ${courseNumber}`);
      });
    });

    coursesCache.timestamp = now;

    // Set up real-time listener to update cache
    onSnapshot(coursesCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const subject = change.doc.id;
        const numbers = change.doc.data().numbers || [];

        if (change.type === 'added' || change.type === 'modified') {
          numbers.forEach((courseNumber) => {
            coursesCache.data.add(`${subject} ${courseNumber}`);
          });
        } else if (change.type === 'removed') {
          numbers.forEach((courseNumber) => {
            coursesCache.data.delete(`${subject} ${courseNumber}`);
          });
        }
      });
      coursesCache.timestamp = Date.now();
    });

    return Array.from(coursesCache.data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

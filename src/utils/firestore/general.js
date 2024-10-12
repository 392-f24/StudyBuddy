// General Firestore functions (shared utilities)
import { db } from '@utils/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Get all users from Firestore
export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);
    return usersSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
};

// Get list of majors from Firestore
export const getMajors = async () => {
  try {
    const majorsDocRef = doc(collection(db, 'majorsCourses'), 'majors');
    const majorsSnapshot = await getDoc(majorsDocRef);
    return majorsSnapshot.exists() ? majorsSnapshot.data().majors : [];
  } catch (error) {
    console.error('Error fetching majors:', error);
    return [];
  }
};

// Get list of courses from Firestore and store them as an set
export const getCourses = async () => {
  try {
    const coursesCollectionRef = collection(db, 'courseData');
    const coursesSnapshot = await getDocs(coursesCollectionRef);

    const coursesSet = new Set();
    coursesSnapshot.docs.forEach((doc) => {
      const subject = doc.id;
      const numbers = doc.data().numbers || [];

      numbers.forEach((courseNumber) => {
        coursesSet.add(`${subject} ${courseNumber}`); // Add unique combination to Set
      });
    });

    // Convert Set to Array to eliminate duplicates
    return Array.from(coursesSet);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

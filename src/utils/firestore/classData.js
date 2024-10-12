// Functions for fetching and storing class data in Firestore
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '../firebaseConfig';

// Get latest term from APi and update if necessary
const checkAndInsertLatestTerm = async () => {
  try {
    // Gather latest term data from API
    const TermResponse = await fetch('https://api.dilanxd.com/paper/data');
    if (!TermResponse.ok) throw new Error(`Failed to fetch data: ${TermResponse.statusText}`);

    const TermData = await TermResponse.json();
    const LatestTermID = TermData.latest;
    if (!LatestTermID) throw new Error(`'latest' term not found in initial data`);

    const LatestTermName = TermData.terms[LatestTermID].name;

    // Reference Firestore document
    const termDocRef = doc(collection(db, 'majorsCourses'), 'latestTerm');
    const termSnapshot = await getDoc(termDocRef);

    const termData = termSnapshot.exists() ? termSnapshot.data() : null;
    // Insert or update term if necessary
    if (!termData || termData.latestTermID !== LatestTermID) {
      const newTermData = { latestTermID: LatestTermID, latestTermName: LatestTermName };
      termSnapshot.exists()
        ? await updateDoc(termDocRef, newTermData)
        : await setDoc(termDocRef, newTermData);
    } else {
      throw new NoUpdateError('Latest term already exists in Firestore');
    }

    return LatestTermID;
  } catch (error) {
    console.error('Error handling latest term:', error);
    return null;
  }
};

// Gathering class data from API and storing in Firestore
export const fetchAndStoreClassData = async () => {
  try {
    const LatestTermID = await checkAndInsertLatestTerm();
    if (!LatestTermID) return true;

    const ClassResponse = await fetch(`https://cdn.dil.sh/paper-data/${LatestTermID}.json`);
    if (!ClassResponse.ok)
      throw new Error(`Failed to fetch class data: ${ClassResponse.statusText}`);

    const ClassData = await ClassResponse.json();

    // Create a map to store subjects and their associated numbers
    const subjectMap = new Map();

    // Iterate over ClassData and build subject-number pairs
    ClassData.forEach((classItem) => {
      const { u: subject, n: number } = classItem;

      // If the subject already exists in the map, append the number to its array
      if (subjectMap.has(subject)) {
        subjectMap.get(subject).push(number);
      } else {
        // Otherwise, create a new entry for this subject with the number
        subjectMap.set(subject, [number]);
      }
    });

    // Clear the existing courseData collection in Firestore
    const courseDataRef = collection(db, 'courseData');
    const courseDataSnapshot = await courseDataRef.get();
    courseDataSnapshot.forEach(async (doc) => {
      await setDoc(doc.ref, { numbers: [] });
    });

    // Iterate over the subjectMap and store each subject with its numbers in Firestore
    for (const [subject, numbers] of subjectMap) {
      const subjectDocRef = doc(collection(db, 'courseData'), subject);
      await setDoc(subjectDocRef, { numbers });
    }

    return true;
  } catch (error) {
    console.error('Error fetching or saving data:', error);
    return false;
  }
};

// Fetch all class data from Firestore (for a specific subject)
export const fetchClassData = async (subject) => {
  try {
    const classDocRef = doc(collection(db, 'courseData'), subject);
    const classSnapshot = await getDoc(classDocRef);

    if (!classSnapshot.exists()) {
      throw new Error(`No class data found for subject ${subject} in Firestore`);
    }

    return classSnapshot.data().numbers;
  } catch (error) {
    console.error('Error fetching class data:', error);
    return null;
  }
};

// Fetch by Specific subject
export const fetchBySubject = async (subject) => {
  try {
    const classDocRef = doc(collection(db, 'courseData'), subject);
    const classSnapshot = await getDoc(classDocRef);

    if (!classSnapshot.exists()) {
      throw new Error(`No class data found for subject ${subject} in Firestore`);
    }

    return classSnapshot.data().numbers;
  } catch (error) {
    console.error('Error fetching class data:', error);
    return null;
  }
};

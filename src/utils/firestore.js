/* eslint-disable max-len */
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  writeBatch,
  arrayUnion,
  query,
  where,
} from 'firebase/firestore';

import { db } from './firebase'; // import db from the firebase.js

// Check or Create user profile in Firestore
export const createUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // Create a new profile if it doesn't exist
      await setDoc(userDocRef, {
        name: user.displayName || 'Anonymous',
        profilePic: user.photoURL || '', // Store the profile picture URL
        email: user.email || '',
        phoneNumber: user.phoneNumber || '', // optional
        major: '', // optional
        year: '', // optional
        courses: {}, // empty object, to be updated later
        bio: '', // optional
        groups: {}, // empty object, to be updated later
        pastGroups: {}, // empty object, to be updated later
        incomingRequests: {}, // empty object, to be updated later
        outgoingRequests: {}, // empty object, to be updated later
      });
      console.log('User profile created');
    } else {
      console.log('User profile exists');
      return userSnapshot.data(); // return user data if it exists
    }
  } catch (error) {
    console.error('Error creating or updating user profile:', error);
  }
};

// Get user profile by uid
export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data(); // return user data
    } else {
      console.log('No such user profile found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// Update user profile by uid
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
    console.log('User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Creates a new group in the database
// ownerUID: User that requested to create the group
// meetingTime: Specified meeting time for study group
// meetingLocation: Specified meeting location for study group
// description (optional): Description of the study group
export const createGroup = async (ownerUID, meetingTime, meetingLocation, description = '') => {
  try {
    const group = {
      owner: ownerUID,
      members: [ownerUID], // Assuming the owner is the first member
      open: true,
      meetingTime: meetingTime,
      meetingLocation: meetingLocation,
      description: description,
    };

    const docRef = await collection('groups').add(group);

    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Allows a user to request to join a specified group
// groupId: The ID of the group the user wants to join
// userUID: The UID of the user requesting to join the group
export const requestToJoinGroup = async (groupId, userUID) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists) {
      throw new Error('Group does not exist');
    }

    const ownerUID = groupDoc.data().owner;
    const ownerRef = doc(db, 'users', ownerUID);
    const ownerDoc = await getDoc(ownerRef);
    if (!ownerDoc.exists) {
      throw new Error('Owner of group does not exist');
    }

    const userRef = doc(db, 'users', userUID);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists) {
      throw new Error('User does not exist');
    }

    const batch = writeBatch(db);

    // Update the user's 'outgoingRequests' array to include the groupId
    batch.update(userRef, {
      outgoingRequests: arrayUnion(groupId),
    });

    // Update the owner's 'incomingRequests' array to include the user's UID and the groupId
    batch.update(ownerRef, {
      incomingRequests: arrayUnion({ groupId, userUID }),
    });

    await batch.commit();

    return true;
  } catch (error) {
    console.error('Error requesting to join group:', error);
    throw error;
  }
};

// Adds a new user to a specified group and updates their profile
// groupId: The ID of the group to add the user to
// userUID: The UID of the user to be added to the group
export const addUserToGroup = async (groupId, userUID) => {
  const groupRef = collection('groups').doc(groupId);
  if (!groupDoc.exists) {
    throw new Error('Group does not exist');
  }

  const userRef = collection('users').doc(userUID);
  if (!userUID.exists) {
    throw new Error('User does not exist');
  }

  try {
    const batch = writeBatch(db);

    // Update the group's 'members' array field to include the new user
    batch.update(groupRef, {
      members: arrayUnion(userUID),
    });

    // Update the user's 'groups' array field to include the group ID
    batch.update(userRef, {
      groups: arrayUnion(groupId),
    });

    await batch.commit();

    return true;
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw error;
  }
};

// Returns a user's incoming requests
// userUID: The UID of the user whose incoming requests you want to retrieve
export const getIncomingRequests = async (userUID) => {
  try {
    const userRef = collection('users').doc(userUID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User does not exist');
    }

    // Retrieve the 'incomingRequests' field
    const incomingRequests = userDoc.data().incomingRequests || [];

    return incomingRequests;
  } catch (error) {
    console.error('Error retrieving incoming requests:', error);
    throw error;
  }
};

// Returns a user's outgoing requests
// userUID: The UID of the user whose outgoing requests you want to retrieve
export const getOutgoingRequests = async (userUID) => {
  try {
    const userRef = doc(db, 'users', userUID);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists) {
      throw new Error('User does not exist');
    }

    // Retrieve the 'outgoingRequests' field
    const outgoingRequests = userDoc.data().outgoingRequests || [];

    return outgoingRequests;
  } catch (error) {
    console.error('Error retrieving outgoing requests:', error);
    throw error;
  }
};

// Returns all the groups that a user is currently in
// userUID: The UID of the user whose current groups you want to retrieve
export const getUserCurrentGroups = async (userUID) => {
  try {
    const userRef = collection('users').doc(userUID);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists) {
      throw new Error('User does not exist');
    }

    const groupIds = userDoc.data().groups || [];

    // Fetch details of each group using the group IDs
    const groupPromises = groupIds.map((groupId) => collection(db, 'groups').doc(groupId));
    const groupDocs = await Promise.all(groupPromises);

    // Extract group data
    const groups = groupDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    return groups;
  } catch (error) {
    console.error('Error retrieving current groups:', error);
    throw error;
  }
};

// Returns all the groups that a user was in previously
// userUID: The UID of the user whose past groups you want to retrieve
export const getUserPastGroups = async (userUID) => {
  try {
    const userRef = collection('users').doc(userUID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User does not exist');
    }

    // Retrieve the 'pastGroups' field
    const pastGroupIds = userDoc.data().pastGroups || [];

    // Fetch details of each past group using the group IDs
    const groupPromises = pastGroupIds.map((groupId) => collection('groups').doc(groupId).get());
    const groupDocs = await Promise.all(groupPromises);

    // Extract group data
    const pastGroups = groupDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    return pastGroups;
  } catch (error) {
    console.error('Error retrieving past groups:', error);
    throw error;
  }
};

// Returns all "open" groups in the database
export const getOpenGroups = async () => {
  try {
    // Create a query against the "groups" collection where the 'open' field is true
    const q = query(collection(db, 'groups'), where('open', '==', true));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract group data
    const openGroups = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return openGroups;
  } catch (error) {
    console.error('Error retrieving open groups:', error);
    throw error;
  }
};

// Closes a specified group
// groupId: The ID of the group to close
export const closeGroup = async (groupId) => {
  try {
    const groupRef = collection('groups').doc(groupId);

    // Update the 'open' field to false
    await groupRef.update({
      open: false,
    });

    return true;
  } catch (error) {
    console.error('Error closing the group:', error);
    throw error;
  }
};

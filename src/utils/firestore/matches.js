import { fetchUserProfile } from '@firestore/userProfile';
import { db } from '@utils/firebaseConfig';
import {
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  arrayUnion,
  arrayRemove,
  collection,
} from 'firebase/firestore';

// Batch fetch match documents using getDocs by match IDs
const fetchMatchDocuments = async (matchIds) => {
  try {
    const q = query(collection(db, 'matches'), where('__name__', 'in', matchIds));
    const querySnapshot = await getDocs(q);

    // Return all match data from Firestore
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error('Error fetching match documents:', error);
    return [];
  }
};

// Create a new match
export const createMatch = async (users, location, description = '') => {
  if (!Array.isArray(users) || users.length < 2) {
    throw new Error('Invalid user list');
  }
  if (!location) {
    throw new Error('Missing required match details');
  }

  const usersWithStatus = users.map((userId, index) => ({
    uid: userId,
    status: index === 0 ? 'confirmed' : 'pending', // First user is confirmed
    joinedAt: new Date().toISOString(),
  }));

  try {
    const matchRef = doc(collection(db, 'matches'));
    await runTransaction(db, async (transaction) => {
      const userProfiles = await Promise.all(
        usersWithStatus.map((user) => fetchUserProfile(user.uid, transaction)),
      );

      // Set the match document
      transaction.set(matchRef, {
        users: usersWithStatus,
        location,
        description,
        awaitingConfirmation: false,
        createdAt: new Date().toISOString(),
      });

      // Update user match references
      transaction.update(userProfiles[0].ref, {
        incomingMatches: arrayUnion({
          requestingUser: userProfiles[1].profile.uid,
          matchId: matchRef.id,
        }),
      });

      transaction.update(userProfiles[1].ref, {
        outgoingMatches: arrayUnion({
          requestedUser: userProfiles[0].profile.uid,
          matchId: matchRef.id,
        }),
      });
    });

    console.log('Match created with ID: ', matchRef.id);
    return matchRef.id;
  } catch (error) {
    console.error('Error creating match:', error);
  }
};

// Get all user matches
export const getUserMatches = async (uid) => {
  try {
    const { profile: userProfile } = await fetchUserProfile(uid); // Use fetchUserProfile
    if (!userProfile) {
      throw new Error('User profile does not exist');
    }

    const { currentMatches } = userProfile;
    if (!currentMatches || currentMatches.length === 0) return [];

    // Fetch match documents in a batch using getDocs
    const matchDocs = await fetchMatchDocuments(currentMatches);

    const profiles = await Promise.all(
      matchDocs.map((matchData) =>
        Promise.all(
          matchData.users
            .filter((user) => user.uid !== uid)
            .map(async (user) => {
              const { profile } = await fetchUserProfile(user.uid);
              return profile || null;
            }),
        ),
      ),
    );

    return profiles.flat().filter((profile) => profile !== null);
  } catch (error) {
    console.error('Error fetching user matches:', error);
    return [];
  }
};

// Resolve match request (accept or decline)
export const resolveMatchRequest = async (requestedUserUid, requestingUserUid, matchId, accept) => {
  try {
    await runTransaction(db, async (transaction) => {
      const requestedUserRef = doc(db, 'users', requestedUserUid);
      const requestingUserRef = doc(db, 'users', requestingUserUid);
      const matchRef = doc(db, 'matches', matchId);

      // Update incoming and outgoing matches
      transaction.update(requestedUserRef, {
        incomingMatches: arrayRemove({ requestingUser: requestingUserUid, matchId }),
      });
      transaction.update(requestingUserRef, {
        outgoingMatches: arrayRemove({ requestedUser: requestedUserUid, matchId }),
      });

      if (accept) {
        transaction.update(requestedUserRef, { currentMatches: arrayUnion(matchId) });
        transaction.update(requestingUserRef, { currentMatches: arrayUnion(matchId) });
      } else {
        transaction.delete(matchRef);
      }
    });

    console.log(`Match request resolved successfully (${accept ? 'accepted' : 'denied'})`);
  } catch (error) {
    console.error('Error resolving match request:', error);
  }
};

// Get matched user UIDs for a specific user
export const getMatchedUserUids = async (userUid) => {
  try {
    const { profile: userProfile } = await fetchUserProfile(userUid); // Use fetchUserProfile
    if (!userProfile) {
      throw new Error('User profile does not exist');
    }

    const { currentMatches } = userProfile;
    if (!currentMatches || currentMatches.length === 0) return [];

    const matchedUserUids = new Set();

    await Promise.all(
      currentMatches.map(async (matchId) => {
        const matchData = await fetchMatchDocuments([matchId]); // Use batch fetch here
        if (matchData.length > 0) {
          matchData[0].users.forEach((user) => {
            if (user.uid !== userUid) {
              matchedUserUids.add(user.uid);
            }
          });
        }
      }),
    );

    return Array.from(matchedUserUids);
  } catch (error) {
    console.error('Error fetching matched user UIDs:', error);
    return [];
  }
};

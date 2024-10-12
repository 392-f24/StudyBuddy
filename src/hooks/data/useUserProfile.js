import { useEffect, useState } from 'react';

import { getMatchedUserUids } from '@firestore/matches';
import { fetchUserProfile } from '@firestore/userProfile';

export default function useUserProfile(user) {
  const [userProfile, setUserProfile] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [matchedUserUids, setMatchedUserUids] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserProfileData = async () => {
        try {
          // Fetch user profile using the unified function
          const { profile } = await fetchUserProfile(user.uid);

          if (profile) {
            setUserProfile(profile);
            setRequestedUsers(new Set(profile.outgoingMatches.map((match) => match.requestedUser)));

            const matchedUids = await getMatchedUserUids(user.uid);
            setMatchedUserUids(new Set(matchedUids));
          } else {
            // Handle the case where profile is not found
            console.warn('User profile does not exist.');
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
        setLoading(false);
      };

      fetchUserProfileData();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  return { userProfile, requestedUsers, setRequestedUsers, matchedUserUids, loading };
}

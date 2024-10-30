import { useEffect, useState } from 'react';

import { auth } from '@utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Hook to get the current user
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setUser(user),
      (error) => setError(error),
    );

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  console.log(user);
  return [user, error];
};

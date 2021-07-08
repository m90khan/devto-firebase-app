import { auth, firestore } from '@lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth); // listen to current user in firebasee
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription when not needed anymore
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe; // when user doc is no longer needed . return in useEffect = componentDidUnmount
  }, [user]);

  return { user, username };
}

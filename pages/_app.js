import { UserContext } from '@lib/context';
import { useUserData } from '@lib/hooks';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Toaster />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;

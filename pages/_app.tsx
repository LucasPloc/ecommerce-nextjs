import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '../store/store';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      {' '}
      <Provider store={store}>
        <Toaster />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;

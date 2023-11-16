import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';

function App({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot >
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default App 
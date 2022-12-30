import App from 'next/app';
import { useState } from 'react';
import ky from '~/api/ky'

import '~/styles/index.css'

import AuthContext from '~/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';

NextApp.getInitialProps = async (ctx) => {
  // Is SSR
  if (ctx?.ctx?.req) {
    const response = await ky.get(`api/web-init`);
    const { data } = await response.json();
    const appData = App.getInitialProps(ctx);

    return {
      ...appData, 
      data,
    }
  }

  return {}
}

function NextApp({ Component, pageProps, data }) {
  const [authUser] = useState(data);
  const queryClient = new QueryClient();

  return (
    <AuthContext.Provider value={authUser}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthContext.Provider>
  )
}

export default NextApp;
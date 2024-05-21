import { useEffect, useState } from 'react';

import '@/styles/globals.css';
import { NearContext } from '@/context';
import { Navigation } from '@/components/Navigation';

import { Wallet } from '@/wallets/near';
import { NetworkId, CoinFlipContract } from '@/config';

const wallet = new Wallet({ createAccessKeyFor: CoinFlipContract, networkId: NetworkId });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Navigation />
      <Component {...pageProps} />
    </NearContext.Provider>
  );
}
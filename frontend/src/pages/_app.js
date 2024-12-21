import { useEffect, useState } from 'react';

import '@/styles/globals.css';
import { NearContext } from '@/context';
import { Navigation } from '@/components/Navigation';

import { Wallet } from '@/wallets/near';
import { NetworkId, CoinFlipContract } from '@/config';

// Wallet instance
const wallet = new Wallet({ networkId: NetworkId });

// Optional: Create an access key so the user does not need to sign transactions. Read more about access keys here: https://docs.near.org/concepts/protocol/access-keys
// const wallet = new Wallet({
//   createAccessKeyFor: CoinFlipContract,
//   networkId: NetworkId,
// });


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
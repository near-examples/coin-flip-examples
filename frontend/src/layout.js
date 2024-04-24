import { useEffect } from 'react';
import { create as createStore } from 'zustand';

import { Wallet } from '@/wallets/near-wallet';
import { Navigation } from '@/components/Navigation';
import { NetworkId, CoinFlipContract } from '@/config';

// Store to share wallet and signed account
export const useStore = createStore((set) => ({
  wallet: undefined,
  signedAccountId: '',
  setWallet: (wallet) => set({ wallet }),
  setSignedAccountId: (signedAccountId) => set({ signedAccountId })
}));

export default function RootLayout({ children }) {

  const { setWallet, setSignedAccountId } = useStore();

  useEffect(() => {
    // create wallet instance
    const wallet = new Wallet({ createAccessKeyFor: CoinFlipContract, networkId: NetworkId });
    wallet.startUp(setSignedAccountId);
    setWallet(wallet);
  }, []);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

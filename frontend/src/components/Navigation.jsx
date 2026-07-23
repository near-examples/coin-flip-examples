import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNearWallet } from 'near-connect-hooks';

import NearLogo from '../../public/near-logo.svg';
import { CoinFlipContract } from '@/config';


export const Navigation = () => {
  const { signedAccountId, signIn, signOut } = useNearWallet();
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      // Create a function-call access key for the contract during sign-in
      // (replaces the old wallet-selector `createAccessKeyFor` option)
      setAction(() => () => signIn({
        addFunctionCallKey: {
          contractId: CoinFlipContract,
          allowMethods: { anyMethod: false, methodNames: ['flip_coin'] },
          gasAllowance: { kind: 'limited', amount: '250000000000000000000000' },
        },
      }));
      setLabel('Login');
    }
  }, [signedAccountId]);

  return (
    <nav className="navbar bg-body border-bottom">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <Image priority src={NearLogo} alt="NEAR" width="30" height="24" />
          <span className="fw-semibold">Coin Flip</span>
        </Link>
        <div className='navbar-nav pt-1'>
          <button
            className="btn btn-outline-secondary text-truncate"
            style={{ maxWidth: '16rem' }}
            onClick={action}
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};
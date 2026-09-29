import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNearWallet } from '@/components/near-provider';

import NearLogo from '../../public/near-logo.svg';

export const Navigation = () => {
  const { signedAccountId, signIn, signOut } = useNearWallet();
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => () => signIn());
      setLabel('Login');
    }
  }, [signedAccountId, signIn, signOut]);

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
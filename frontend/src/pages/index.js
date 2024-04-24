import Coin from '@/components/Coin';
import CoinGame from '@/components/CoinGame';
import { useStore } from '@/layout';
import styles from '@/styles/app.module.css';
import { useEffect, useState } from 'react';



export default function Home() {

  const { signedAccountId } = useStore();

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  return (
    <main className={styles.main}>
      <div className="container">
        {loggedIn || <h1><strong>Welcome! Login to Play</strong></h1>}
        <Coin />
        {loggedIn && <CoinGame />}
      </div>

    </main>
  );
}
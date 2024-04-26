import Coin from '@/components/Coin';
import CoinGame from '@/components/CoinGame';
import { useStore } from '@/layout';
import styles from '@/styles/app.module.css';
import { useEffect, useState } from 'react';



export default function Home() {

  const { signedAccountId } = useStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  return (
    <main className={styles.main}>
      <div className="container">
        {loggedIn || <h1 className='text-center'><strong>Welcome! Login to Play</strong></h1>}
        <Coin loading={loading}  result={result} />
        {loggedIn && <CoinGame setLoading={setLoading} setResult={setResult} result={result}/>}
      </div>

    </main>
  );
}
import 'regenerator-runtime/runtime'
import React from 'react'
import './assets/css/global.css'
import { callSmartContractFunction, viewBlockchainState } from './near-api'
import { EducationalText, NearInformation, SignInPrompt, SignOutButton } from './ui-components';

export default function App() {
  // Will store data returned from the blockchain in component state
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(false);

  // If user not signed-in with wallet - show prompt
  if (!window.walletConnection.isSignedIn()) {
    // Sign-in flow will reload the page later
    return SignInPrompt();
  } else {
    // Get blockchian state once on component load
    React.useEffect(() => {
      viewBlockchainState()
        .then(val => setValueFromBlockchain(val));
    }, []);
  }

  return (
    <>
      <SignOutButton/>
      <main className={uiPleaseWait && 'please-wait'}>
        <h1>Flip a Coin</h1>

        <div className='change'>
          <button onClick={() => {
            setUiPleaseWait(true);
            callSmartContractFunction('heads').then(_ =>
              {
                viewBlockchainState()
                  .then(val => setValueFromBlockchain(val));
                setUiPleaseWait(false)
              });
          }}>
            Choose<br/> <span>Heads</span>
          </button>
          <button onClick={() => {
            setUiPleaseWait(true);
            callSmartContractFunction('tails').then(_ =>
              {
                viewBlockchainState()
                  .then(val => setValueFromBlockchain(val));
                setUiPleaseWait(false)
              });
          }}>
            Choose<br/> <span>Tails</span>
          </button>
        </div>

        <NearInformation message={valueFromBlockchain}/>

        <EducationalText/>
      </main>
    </>
  )
}

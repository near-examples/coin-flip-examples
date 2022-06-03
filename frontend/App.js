import 'regenerator-runtime/runtime'
import React from 'react'

import './assets/css/global.css'

import {login, logout, get_points, flip_coin} from './utils/utils'
import getConfig from './utils/config'


export default function App() {
  // use React Hooks to store greeting in component state
  const [points, setPoints] = React.useState()

  // Keeps track of the current selection (heads or tails)
  const [selection, setSelection] = React.useState("heads")

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      if(window.walletConnection.isSignedIn()) {
        // get_points is in near/utils.js
        get_points()
        .then(pointsForAccount => {
          setPoints(pointsForAccount)
        })
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
            {"Hello! "}
          </label>
          Welcome to NEAR!
        </h1>
        <p>
        Your contract is a simple coin flipping game. If you win, your account gets a point. 
        If you lose, your account loses a point. This information is stored on the NEAR blockchain. To
        play you need to sign in using the NEAR Wallet. It is very simple,
        just use the button below.
        </p>
        <p>
        Do not worry, this app runs in the test network ("testnet"). It works
        just like the main network ("mainnet"), but using NEAR Tokens that are
        only for testing!
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
            Your Points: {points == false ? 0 : points}
          </label>
          {' '/* React trims whitespace around tags; insert literal space character when needed */}
          {window.accountId}!
        </h1>
        <form onSubmit={async event => {
          event.preventDefault()

          let { fieldset } = event.target;
          // get elements from the form using their id attribute
          console.log('selected: ', selection)

          // disable the form while the value gets updated on-chain
          fieldset.disabled = true

          try {
            // make an update call to the smart contract
            // pass the side that the user chose
            await flip_coin(selection, points)
          } catch (e) {
            alert(
              'Something went wrong! ' +
              'Maybe you need to sign out and back in? ' +
              'Check your browser console for more info.'
            )
            throw e
          } finally {
            // re-enable the form, whether the call succeeded or failed
            fieldset.disabled = false
          }
          
          // get_points is in near/utils.js
          get_points()
          .then(pointsForAccount => {
            setPoints(pointsForAccount)
          })

          // show Notification
          setShowNotification(true)

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }}>
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Flip Coin - Note: your first flip requires a deposit
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <select 
              onChange={(e) => {
                setSelection(e.target.value)
              }}
              style={{ borderRadius: '5px 0px 0px 5px', width: "100%"}}
              >
                <option selected value="heads">Heads</option>
                <option value="tails">Tails</option>
              </select>
              <button
                style={{ borderRadius: '0 5px 5px 0', width: "20%"}}
              >
                Submit
              </button>
            </div>
          </fieldset>
        </form>
        <p>
          Look at that! A Simple JavaScript Contract WebApp! Your points are stored on the blockchain. Check it out:
        </p>
        <ol>
          <li>
            Look in <code>src/App.js</code> and <code>src/utils.js</code> – you'll see <code>get_points</code> and <code>flip_coin</code> being called on the <code>contract</code>. What's this?
          </li>
          <li>
            Ultimately, this <code>contract</code> code is defined in <code>src/index.js</code> – this is the source code for your <a target="_blank" rel="noreferrer" href="https://docs.near.org/docs/develop/contracts/overview">smart contract</a>.</li>
          <li>
            When you run <code>yarn dev</code>, the code in <code>src/index.js</code> gets deployed to the NEAR testnet. You can see how this happens by looking in <code>package.json</code> at the <code>scripts</code> section to find the <code>dev</code> command.</li>
        </ol>
        <hr />
        <p>
          To keep learning, check out <a target="_blank" rel="noreferrer" href="https://docs.near.org">the NEAR docs</a> or look through some <a target="_blank" rel="noreferrer" href="https://examples.near.org">example apps</a>.
        </p>
      </main>
      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const { networkId, contractName } = getConfig(process.env.NODE_ENV || 'development')
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`

  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'flipCoin' in contract: 
      {' '}
      {contractName}
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
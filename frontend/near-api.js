import { connect, keyStores, WalletConnection } from 'near-api-js'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { getConfig } from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract and set global variables
export async function initContract() {
  // Initialize connection to the NEAR blockchain
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If signed-out, it's empty string
  window.accountId = window.walletConnection.getAccountId();
}

export function signInWithNearWallet() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn('jsvm.testnet');
}

export function signOutNearWallet() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

/*
  Performs a view call to contract's `view_greeting` method, to get data from the blockchain
*/
export async function viewBlockchainState() {
  let account = window.walletConnection.account();

  const currentState = await account.viewFunction(
    nearConfig.contractName,
    'view_greeting',
    {},
    {
      // For calls to the JSVM set jsCotract:true
      jsContract: true
    }
  );

  return currentState;
}

/*
  Calls a contract method which will manipulate blockchain state.
*/
export async function callSmartContractFunction(messageArg) {
  let account = window.walletConnection.account();

  // Use near-api-js to perform a smart contract function call
  const result = await account.functionCall({
    contractId: nearConfig.contractName,
    methodName: 'set_greeting',
    args: {
      'message': messageArg
    },
    gas: '300000000000000',
    attachedDeposit: parseNearAmount('0.01'),
    // For calls to the JSVM set jsCotract:true
    jsContract: true,
  });

  return result;
}

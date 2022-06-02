import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

function encodeCall(contract, method, args) {
  return Buffer.concat([Buffer.from(contract), Buffer.from([0]), Buffer.from(method), Buffer.from([0]), Buffer.from(args)])
}

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), "jsvm.testnet", {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['view_js_contract'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['call_js_contract'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn("jsvm.testnet")
}

export async function flip_coin(side, points){
  if (points == false) {
    console.log("First Time Playing!");
  }

  let args = encodeCall(nearConfig.contractName, 'flipCoin', `["${side}"]`);
  let account = window.walletConnection.account();

  const result = await account.functionCall({
    contractId: "jsvm.testnet",
    methodName: 'call_js_contract',
    args,
    gas: "300000000000000",
    attachedDeposit: points == false ? parseNearAmount("0.1") : "0"
  });
  
  return result
}

export async function get_points() {
  let args = encodeCall(nearConfig.contractName, 'viewPoints', `["${window.walletConnection.getAccountId()}"]`);
  let account = window.walletConnection.account();
  
  const points = await account.viewFunction("jsvm.testnet", 'view_js_contract', args, {
    stringify: (val) => val,
  });
  
  return points
}
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { functionCall } from 'near-api-js/lib/transaction'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
console.log('nearConfig: ', nearConfig)

function encodeCall(contract, method, args) {
  return Buffer.concat([Buffer.from(contract), Buffer.from([0]), Buffer.from(method), Buffer.from([0]), Buffer.from(args)])
}

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
  console.log('near: ', near)

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()
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

export async function callFunction(value, deposit) {
  let args = {
    "message": value
  }
    //encodeCall(nearConfig.contractName, 'set_greeting', `["${value}"]`);
  let account = window.walletConnection.account();

  const result = await account.functionCall({
    contractId: nearConfig.contractName,
    methodName: 'set_greeting',
    args: args,
    gas: "300000000000000",
    attachedDeposit: parseNearAmount(deposit),
    jsContract: true,
  });
  
  return result
}

export async function viewState() {
  //let args = encodeCall(nearConfig.contractName, 'get_greeting', `["${window.walletConnection.getAccountId()}"]`);
  let account = window.walletConnection.account();

  let args = {
    "message": window.walletConnection.getAccountId()
  }
  
  // const value = await account.viewFunction(
  //   nearConfig.contractName, 
  //   'get_greeting', 
  //   args,
  //   true
  // )

  return "foo"
}
<center>
    <img src="frontend/assets/img/near_logo_stack_wht.png" width="120" />
</center>

# NEAR-SDK-JS Quick Start 

> This example is designed to get you quickly writing and interacting with smart contracts on the NEAR blockchain using JavaScript! 🚀

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/near-examples/near-sdk-js-quickstart)

---

## Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Exploring the Code](#exploring-the-code)
  - [Smart Contract](#smart-contract)
  - [Front end](#front-end)
- [Example Game](#example-game)
- [Help](#help)

---


## Requirements

- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [near-cli](https://docs.near.org/docs/tools/near-cli) `v3.1.1` or greater

```bash
npm i -g near-cli
```
---

## Quick Start

1) Install dependencies

```bash
npm i
```

2) Launch dApp! 🚀

```bash
npm run start
```

> This script performs the following:
>  - Compiles smart contract located in `./src/index.js` and exports to `./build/contract.base64`
>  - Creates a NEAR [`dev-account`](https://docs.near.org/docs/concepts/account#dev-accounts) with 200 Ⓝ `testnet` tokens. _(If it doesn't already exist)_
>  - Deploys the compiled smart contract to the `dev-account` on NEAR's [`testnet`](https://docs.near.org/docs/concepts/networks#testnet)
>  - Launches a local front-end that is connected to the smart contract (dApp)

  ---

## Exploring the code

```bash
.
├── frontend
│   ├── App.js
│   ├── assets
│   ├── index.html
│   ├── index.js
│   └── utils
├── src
│   └── index.js  <------[ Smart Contract ]
├── babel.config.json
├── LICENSE
├── package.json
└── README.md

```

## Smart Contract

> As illustrated above, the [smart contract](https://en.wikipedia.org/wiki/Smart_contract) is located in `./src/index.js`.

Here you will see a few dependencies imported from `near-sdk-js` that is used for the creation of a smart contract.

- `NearBindgen` 
  - This decorator allows the JS code to be compiled to WebAssembly; a format that is compatible with the NEAR blockchain. 
  
- `NearContract`
  - A constructor class that assists with the compiling of the smart contract and ensures its created using the proper format. The constructor must be called after deploying the contract and can be used to initialize variables stored on the contract with default values.
  
- `call` 
  - A decorator that indicates a `change` method or a function that changes state on the blockchain. Note that change methods cost gas. For more information see our [documentation on gas](https://docs.near.org/docs/concepts/gas). 

- `view` 
  - A decorator that indicates a `view` method or a function that returns values stored on the blockchain. View calls are free and do not cost gas.

## Frontend

```bash
.
├── App.js      <------- Core logic for the application
├── assets
│   ├── css
│   └── img
├── config.js   <------- Contract ID & various network environment settings
├── index.html
├── index.js
└── utils.js    <------- Contract initialization, NEAR Wallet setup, & dApp functions
```

> A simple [React](https://reactjs.org/) front end that uses [`near-api-js`](https://github.com/near/near-api-js) to connect to the NEAR blockchain.

---

## Example Game

> There are several other branches with different completed contracts that you can use as reference:

- `coin-flip-skeleton` contains the skeleton code for the coin flipping game
- `coin-flip-finished` contains the finished code for the coin flipping game
- `coin-flip-hub` contains the finished code for the hub contract.

The actual on-chain interactions take place in the `flip_coin` and `get_points` functions defined in `frontend/utils/utils.js`.

To test the fully working contract alongside the frontend, switch to the `coin-flip-finished` branch and follow the steps outlined in the [Quickstart](#quick-start) section.


## HELP

## Starting from scratch

If you don't want to use the template and instead start from scratch, the [Enclave Quickstart](https://docs.near.org/docs/develop/contracts/js/enclave-quickstart) guide found in docs runs you through how to create your own JavaScript smart contract environment in a couple very easy steps. In the tutorial, you'll learn how to create a simple contract for setting and getting a greeting message on-chain.




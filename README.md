<center>
    <img src="frontend/assets/img/near_logo_stack_wht.png" width="120" />
</center>

# NEAR-SDK-JS Quick Start

> This example is designed to quickly get you writing and interacting with smart contracts on the NEAR blockchain using JavaScript! 🚀

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/near-examples/near-sdk-js-quickstart)

---

## Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Exploring the Code](#exploring-the-code)
  - [Smart Contract](#smart-contract)
  - [Front end](#front-end)
- [Storage](#storage)
- [Example Game](#example-game)
- [Feedback](#feedback)
- [Help](#help)

---

## Requirements

- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [near-cli](https://docs.near.org/tools/near-cli) `v3.1.1` or greater

```bash
npm install -g near-cli
```

***Note:*** Already using `near-cli`? Ensure you are using `v3.1.1` or greater by running `near --version`.

---

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Launch dApp! 🚀

```bash
npm run start
```

> This script performs the following:
>
> - Compiles smart contract located in `./src/index.js` and exports to `./build/contract.base64`
> - Creates a NEAR [`dev-account`](https://docs.near.org/concepts/basics/account#dev-accounts) with 200 Ⓝ `testnet` tokens.
> - Deploys the compiled smart contract to the `dev-account` on NEAR's [`testnet`](https://docs.near.org/docs/concepts/networks#testnet)
> - Launches a local front-end that is connected to the smart contract (dApp)

---

## Exploring the code

```bash
.
├── frontend
│   ├── App.js
│   ├── assets
│   ├── config.js
│   ├── index.html
│   ├── index.js
│   └── utils.js
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
  - This decorator allows the JS code to be compiled to a format compatible with the `JSVM`; base64.
- `NearContract`
  - A constructing class for creating smart contracts in the proper format.
- `call`
  - A decorator that indicates a `change` method or a function that changes state on the blockchain. Note that change methods cost gas and must be signed. For more information see our [documentation on gas](https://docs.near.org/docs/concepts/gas).
- `view`
  - A decorator that indicates a `view` method or a function that returns values stored on the blockchain. View calls are free and an account isn't needed to execute them.

## Front end

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

## Storage

You may have noticed that sometimes you get redirected to the NEAR wallet asking for some $NEAR when changing the status message. This was to cover storage costs on the blockchain through a concept known as [storage staking](https://docs.near.org/docs/concepts/storage-staking).

When developing on NEAR, smart contracts must maintain enough $NEAR tokens on the account to cover data storage at a rate of 1 $NEAR per 100/kb. Using the `near-api-js`, the `attachedDeposit` parameter will allow you to attach a specified amount of $NEAR to cover the extra information you are storing. You do not need to know the _exact_ amount of $NEAR required as if you overpay, you will be refunded the difference. However, if you _do not_ attach enough $NEAR to your call to cover additional storage, the contract call will fail.

## Example Game

> In this example repo there are several other branches with different completed contracts that you can use to help you learn:

- `skeleton` contains the skeleton code for the coin flipping game
- `coin-flip-finished` contains the finished code for the coin flipping game
- `coin-flip-hub` contains the finished code for the hub contract.

The actual on-chain interactions take place in the `flip_coin` and `get_points` functions defined in `frontend/utils/utils.js`.

To test the fully working contract alongside the frontend, switch to the `coin-flip-finished` branch and follow the steps outlined in the [Quickstart](#quick-start) section.

---

## Feedback

> Help us enhance our JavaScript SDK and participate in its development process!

- Visit our [GitHub discussions](https://github.com/near/near-sdk-js/discussions) and give us your feedback!
- Join one of our monthly [Developer Tools Community Meetings](http://near.ai/tooling-meetings) and give us your feedback or ask some questions!

---

## HELP

> Stuck and need help? There are several ways we can assist you!

- Post a question in #dev-support channel on Discord (http://near.chat).
- Get live support with our Developer Relations team (http://near.org/office-hours) (Twice daily)
- Build from scratch using our [JS SDK Quick Start Guide](https://docs.near.org/docs/develop/contracts/js/enclave-quickstart)) in docs.

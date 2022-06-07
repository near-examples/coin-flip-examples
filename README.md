<center>
    <img src="frontend/assets/img/near_logo_stack_wht.png" width="120" />
</center>

# NEAR-SDK-JS Quick Start 

> This example is designed to get you quickly writing and interacting with smart contracts on the NEAR blockchain using JavaScript! 🚀

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/near-examples/near-sdk-js-quickstart)

---

## Table of Contents

- [Overview](#repository-overview)
- [Requirements](#requirements)
- [Setup](#setup)
- [Getting Started](#getting-started)
- [Coin Toss Game](#coin-toss-game)
- [Support](#support)

---

## Repository Overview

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
---

## Requirements

- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [near-cli](https://docs.near.org/docs/tools/near-cli) `v3.1.1` or greater

```bash
npm i -g near-cli
```
---

## Quick Start

To run this project locally, install the dependencies and run the start script. This will build your contract to `build/contract.base64` which will then be deployed to a dev account. The frontend will then be built and started locally.

```
npm i && npm run start
```

To simply build the contract:

```
npm i && npm run build
```

## Exploring the Code

This template comes in two parts. The frontend code and the smart contract.

## There are several other branches with different completed contracts that you can use as reference:

- `coin-flip-skeleton` contains the skeleton code for the coin flipping game
- `coin-flip-finished` contains the finished code for the coin flipping game
- `coin-flip-hub` contains the finished code for the hub contract.

To test the fully working contract alongside the frontend, switch to the `coin-flip-finished` branch and follow the steps outlined in the [Quickstart](#quick-start) section.

### Frontend

The core logic is found in the `App.js` file which contains the components rendered on the screen. Before the page is rendered, an init function is [run](https://github.com/near-examples/near-sdk-js-quickstart/blob/e78487030a59d5b7ca015dbbdbab228e542a307e/frontend/index.js#L9) which establishes a connection with NEAR. This logic is found in the `frontend/utils/utils.js` file.

The actual on-chain interactions take place in the `flip_coin` and `get_points` functions defined in `frontend/utils/utils.js`.

### Smart Contract

The smart contract is found in the `src/index.js` file and contains a set of methods for you to use. The constructor must be called after deploying the contract and can be used to initialize variables stored on the contract with default values.

The change method can be called whenever you want to modify any variables, or state, stored on the contract. Finally, the view method can be used to view information stored on the contract or execute any code that doesn't modify the state.

## Starting from scratch

If you don't want to use the template and instead start from scratch, the [Enclave Quickstart](https://docs.near.org/docs/develop/contracts/js/enclave-quickstart) guide found in docs runs you through how to create your own JavaScript smart contract environment in a couple very easy steps. In the tutorial, you'll learn how to create a simple contract for setting and getting a greeting message on-chain.




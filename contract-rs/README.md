# Coin Flip 🪙 
[![](https://img.shields.io/badge/⋈%20Examples-Basics-green)](https://docs.near.org/tutorials/welcome)
[![](https://img.shields.io/badge/Gitpod-Ready-orange)](https://gitpod.io/#/https://github.com/near-examples/coin-flip-js)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fnear-examples%2Fcoin-flip-js%2Fbadge%3Fref%3Dmain&style=flat&label=Tests&ref=main)](https://actions-badge.atrox.dev/near-examples/coin-flip-js/goto?ref=main)

Coin Flip is a game were the player tries to guess the outcome of a coin flip. It is one of the simplest contracts implementing random numbers.


# What This Example Shows

1. How to store and retrieve information in the NEAR network.
2. How to integrate a smart contract in a web frontend.
3. How to generate random numbers in a contract.

<br />

# Quickstart

1. Make sure you have installed [rust](https://rust.org/).
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build, Test and Deploy
To build the contract you can execute the `./build.sh` script, which will in turn run:

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

Then, deploy your contract using following commands:

```bash
export CONTRACT_ID=test.near
near deploy "'$CONTRACT_ID'" ./target/wasm32-unknown-unknown/release/contract.wasm
```

<br />

## 2. Retrieve the user points

`points_of` is a `view` method.

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the greeting
near view $CONTRACT_ID points_of '{"player": "'$CONTRACT_ID'"}'
```

<br />

## 3. Flip a coin
`flip_coin` changes the contract's state, for which it is a `call` method.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction. In this case, we are asking the account we created in step 1 to sign the transaction.

```bash
near call $CONTRACT_ID flip_coin '{"player_guess": "tails"}' --accountId $CONTRACT_ID
```

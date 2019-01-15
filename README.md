# Gardener smart contracts

[![CircleCI](https://circleci.com/gh/EspeoBlockchain/gardener-smart-contracts.svg?style=shield)](https://circleci.com/gh/EspeoBlockchain/gardener-smart-contracts)
[![Coverage Status](https://coveralls.io/repos/github/EspeoBlockchain/gardener-smart-contracts/badge.svg)](https://coveralls.io/github/EspeoBlockchain/gardener-smart-contracts)
[![](https://img.shields.io/npm/v/gardener-smart-contracts.svg)](https://github.com/EspeoBlockchain/gardener-smart-contracts)

This repo is a part of Gardener open source oracle project. Initially developed by Espeo Blockchain. Contains all smart contracts used in the project.

Table of contents:
- [Oracle theory](#oracle-theory)
- [Architecture](#architecture)
- [Installation](#installation)
- [Getting started](#getting-started)
- [FAQ](#faq)

## Oracle theory
Oracle is a concept of getting informations from outside of the blockchain into smart contracts. Basically smart contracts cannot call anything which is outside the blockchain network. That's were oracle idea goes into. Smart contract emits event with needed informations and trusted offchain server, which is listening on that, parses it, gets data from offchain data source and passes it back using it's credentials.

## Architecture
[Oracle architecture sketch](images/OracleArchitecture.png) 

## Installation
Project uses Truffle Framework. If you're not familiar with it please look up their [documentation](https://truffleframework.com/docs/truffle/overview).

Requirements:
- `Node.js >= 7.6` - async/await support

Dependencies are installed via `npm install` command.

## Getting started
As a first step please clone `.env.tpl` file into `.env` and fill it with values:
- `PRIVATE_KEY` - used for contracts deployment via single account private key. When you decide to use private key you don't need to pass a mnemonic value. Pass without `0x` prefix.
- `ROPSTEN_PROVIDER_URL` - provider url for connection with blockchain node. We recommend to use one from [Infura](https://infura.io/)
- `MNEMONIC` - HDWallet seed used for contracts deployment instead of a single private key
- `ORACLE_SERVER_ADDRESS` - Ethereum address (public key) of trusted server (required for running migrations even on local ganache network)

Contracts explanation:
- `Oracle` - the most important contract, the heart of the project. It authorizes requests, stores them, emits events and proxies results.
- `UsingOracle` - simple implementation of a smart contract, which is using an `Oracle`. It's optional but feel free to use it by extending one of your contracts from it. You can also implement your own version by adhering to the `UsingOracleI` interface.
- `Authorizable` - part of `Oracle` contract responsible for user authorization. You can grant and revoke access to particular addresses here.
- `StringParser` - library for string parsing and manipulation, useful after receiving result from `Oracle`.
- `OraclizeWrapper` - proxy contract, which together with other smart contracts from `contracts/oraclize` directory makes it painless to migrate from a project using Oraclize solution to our open source oracle.

When you are ready, you can deploy the smart contracts using Truffle's migrations.
- `truffle migrate --network ganache` to deploy to local Ganache test blockchain
- `truffle migrate --network ropsten` to deploy to Ethereum testnet

## Commands
You can use `npx` for running command line tools bundled with the project. If you are new to `npx` please read this [post](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Some of available commands:
- `npx truffle` - locally installed truffle framework
- `npx soldity-coverage` - coverage for smart contracts
- `npx truffle-flattener contracts/...` - contract flattening for etherscan verification

## FAQ
### What is Oraclize and why we decided to develop an open source solution?
[Oraclize](http://www.oraclize.it/) is currently the most popular oracle solution. They were first and their product offers a wide range of applications.
The authors of this project found the Oraclize solution very useful and have used it multiple times. Unfortunately it's served as SaaS which means that every request costs an additional fee.
Because of that, after spending much time working with oracles we decided to create our own implementation.
We strongly believe in blockchain technology and open source. We think that this project can strengthen the Ethereum smart contracts ecosystem. Feel free to use, modify and contribute. Anytime, anywhere, always for free :)
### How to migrate from Oraclize solution to this project?
There is a special wrapper called `OraclizeWrapper` which adheres to Oraclize interface and proxies the requests to our `Oracle`.
To migrate your project you need to deploy this project and the `OraclizeWrapper`, authorized it in `Oracle` contract and then change the address in `OraclizeAddressResolver` to the deployed `OraclizeWrapper`.
This way you don't need to change anything in the source code of your contract (which is crucial when it's already deployed).

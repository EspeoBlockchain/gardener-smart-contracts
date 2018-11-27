# Oracle smart contracts

[![CircleCI](https://circleci.com/gh/espeo/blockchain-oracle-sm.svg?style=shield)](https://circleci.com/gh/espeo/blockchain-oracle-sm)
[![Coverage Status](https://coveralls.io/repos/github/espeo/blockchain-oracle-sm/badge.svg)](https://coveralls.io/github/espeo/blockchain-oracle-sm)

This repo is a part of open source oracle project. Initially developed by Espeo Software. Contains all smart contracts used in the project.

Table of contents:
- [Oracle theory](#oracle-theory)
- [Architecture](#architecture)
- [Installation](#installation)
- [Getting started](#getting-started)
- [FAQ](#faq)

## Oracle theory
Oracle is a concept of getting informations from outside blockchain into smart contracts. Basically smart contracts cannot call anything which is outside the blockchain network. That's were oracle idea goes into. Smart contract emits event with needed informations and trusted offchain server, which is listening on that, parses it, gets data from offchain data source and passes it back using it's credentials.

## Architecture
[Oracle architecture sketch](images/OracleArchitecture.png) 

## Installation
Project uses truffle framework and authors assume that you are familiar with. If not please learn from their [documentation](https://truffleframework.com/docs/truffle/overview).

Requirements:
- `NodeJS >= 7.6` - async/await support

Dependencies are installed via `npm install` command.

## Getting started
Before start please clone `.env.tpl` file into `.env` and fill with values.

Variables explanation:
- `PRIVATE_KEY` - used for contracts deployment via single account private key. When you decided to use private key you don't need to pass mnemonic value. Pass without `0x` prefix.
- `ROPSTEN_PROVIDER_URL` - it's provider url for connection with blockchain node. We recommend to use one from [Infura](https://infura.io/)
- `MNEMONIC` - used for contracts deployment instead from single private key (it's HDWallet seed)
- `ORACLE_SERVER_ADDRESS` - address (public key) of trusted server

Contracts explanation:
- `Oracle` - the most important contract, which is a heart of whole project. It authorizes requests, stores it, emits events and proxies results.
- `UsingOracle` - it's simple implementation of smart contract, which is using `Oracle`. We strongly support flexible, modular coding and using only these features which are needed. Because of that you can implement your own contract doing that, and only you need to follow is to implement `UsingOracleI` interface. Feel free to use developed libraries which should make your development faster and cheaper.
- `Auhtorizable` - part of `Oracle` contract responsible for user authorization. You can grant and revoke access to particular addresses here.
- `StringParser` - library for string parsing and manipulation, useful after receiving result from `Oracle`.
- `OraclizeWrapper` - proxy contract, which together with other smart contract from `oraclize` dir make it painless to migrate from ready project using oraclize solution to open source oracle.


When you are ready, you can deploy smart contracts using truffle migrations.
- `truffle migrate --network development` to deploy to local ganache test blockchain
- `truffle migrate --network ropsten` to deploy to ethereum testnet

## Commands
You can use `npx` for running command line tools bundled with the project. If you are new to `npx` please read this [post](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Some of available commands:
- `npx truffle` - locally installed truffle framework
- `npx soldity-coverage` - coverage for smart contracts
- `npx truffle-flattener contracts/...` - contract flattening for etherscan verification

## FAQ
### What is Oraclize and why we decided to develop our own solution and open sourced that?
[Oraclize](http://www.oraclize.it/) is currently the most popular oracle solution. They were first and their product offers a wide range of applications.
Authors found Oraclize solution as very useful and have used it multiple times before. Unfortunately it's SaaS service and every request costs additional fee. 
Because of that after spending much time in oracles space and get enough knowledge we decided to create our own implementation.
We strongly believe in blockchain technology, and as in any very young ecosystem any open source project would be very precious.
It's our gift for this great community and you. Feel free to use, change and contribute. Anytime, anywhere, always for free :)
### How to migrate from Oraclize solution to this project?
There are special wrapper called `OraclizeWrapper` which mitigates Oraclize interface and proxies requests to `Oracle`. 
Authors tried their best to make the migration possible even when someone's project has already used Oraclize. 
To migrate to this project you need to deploy `OraclizeWrapper`, authorized it in `Oracle` and change address in `OraclizeAddressResolver` to deployed `OraclizeWrapper`. 
In this way you don't need to change anything in the source code of your contract to switch oracle solution (which is crucial when it's already deployed).

// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This is the script that call the abi and interacts witht he blockchain via ethersjs
//

//Code not shared

const { ethers } = require('ethers')
const NonceManager = require('@ethersproject/experimental/lib/nonce-manager')
const enode = require('../configurations/constants').enode
const contractAddress = require('../configurations/constants')
  .DIDContractAddress
const { DIDAbi } = require('../configurations/abi')

let provider = null
let wallet = null
let managedSigner = null
let contract = null
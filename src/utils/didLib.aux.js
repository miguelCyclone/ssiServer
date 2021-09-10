// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This script is an upper abstraction level to call the core funcioanlities from the SC script didlib
// This script is called by the controller to obtain the main functions
// Ethers js is used on this cript, not to interact with the DLT but to use the ethers.utils library
//

const did = require('../lib/didLib')
const { ethers } = require('ethers')

const key = process.env.PRIV_KEY

did.init(key)

function returnMessageSigner(message, signature){
  let signedAddress = ethers.utils.verifyMessage(message, signature)
  return signedAddress
}

function createDID(address) {
  return new Promise(function (resolve, reject) {
    return getController(address) //check if did already exists
      .then((rGetCont) => {
        if (rGetCont.status === 0) {
          return createDIDcore(address)
            .then((rCreateDid) => {
              resolve({ status: rCreateDid.status })
            })
            .catch((error) => {
              resolve({ status: -2.2 })
            })
        } else {
          //there was an error or DID already exists
          resolve({ status: -2.1 })
        }
      })
      .catch((error) => {
        resolve({ status: -2 })
      })
  })
}

function createDIDcore(address) {
  return new Promise(function (resolve, reject) {
    return did
      .createDID(address)
      .then((rCreateDid) => {
        let st = rCreateDid.status
        resolve({ status: st })
      })
      .catch((error) => {
        resolve({ status: -2.22 })
      })
  })
}

function getDIDDocument(didMethod) {
  let didArray = didMethod.split(':')
  let id = didArray[3]
  return new Promise(function (resolve, reject) {
    return getController(id) //check if did already exists
      .then((rGetCont) => {
        if (rGetCont.status === 1) {
          return did
            .getDIDDocument(didMethod)
            .then((rDidDoc) => {
              resolve({ status: 1, didDoc: rDidDoc })
            })
            .catch((error) => {
              console.log('ERROR -1.2', error)
              resolve({ status: -1.2 })
            })
        } else {
          // Did does not exists, or value passed to server was not an address
          resolve({ status: -1.1 })
        }
      })
      .catch((error) => {
        console.log('ERROR -1.0', error)
        resolve({ status: -1.0 })
      })
  })
}

function removeKey(address, index) {
  return new Promise(function (resolve, reject) {
    return getController(address) //check if did already exists
      .then((rGetCont) => {
        if (rGetCont.status === 1) {
          return removeKeyCore(address, index)
            .then((rCreateDid) => {
              resolve({ status: rCreateDid.status })
            })
            .catch((error) => {
              resolve({ status: -3.2 })
            })
        } else {
          //there was an error or DID DOES not exist
          resolve({ status: -3.1 })
        }
      })
      .catch((error) => {
        resolve({ status: -3 })
      })
  })
}

function removeKeyCore(address, index) {
  index = index - 1;
  return new Promise(function (resolve, reject) {
    return did
      .removeKey(address, index)
      .then((rRemoveKey) => {
        resolve({ status: 1 })
      })
      .catch((error) => {
        console.log('ERROR!!!!', error)
        resolve({ status: -3.3 })
      })
  })
}

function getController(address) {
  return new Promise(function (resolve, reject) {
    let addressOK = checkAddress(address)
    if (addressOK === true) {
      return did
        .getController(address)
        .then((rGetCont) => {
          if (
            rGetCont.controller === '0x0000000000000000000000000000000000000000'
          ) {
            resolve({ status: 0 }) //did has no controller
          }
          if (
            rGetCont.controller !=
              '0x0000000000000000000000000000000000000000' &&
            checkAddress(rGetCont.controller) === true
          ) {
            resolve({ status: 1, controller: rGetCont.controller })
          }
        })
        .catch((error) => {
          console.log('ERROR -1.2', error)
          resolve({ status: -1.22 })
        })
    } else {
      resolve({ status: -1.11 })
    }
  })
}

function addKey(address, key, purp) {
  return new Promise(function (resolve, reject) {
    return getController(address) //check if did already exists
      .then((rGetCont) => {
        if (rGetCont.status === 1) {
          //did exists we proceed to check if key format is correct
          if (checkPublicKey(key) === true) {
            //key is publicKey format, we proceed to check if it has already been added
            return getKeys(address)
              .then((rgetKeys) => {
                if (checkKeyAlreadyExist(key, rgetKeys.pubKeys) === false) {
                  //key has not been added for this DID, we proceed with addkeyCore
                  key = Buffer.from(key, 'hex') //convert key to buffer byetarr
                  return addKeyCore(address, key, purp)
                    .then((rAddKey) => {
                      if (rAddKey.status === 1) {
                        resolve({ status: 1 })
                      } else {
                        //not enough gas, keymax reached, no controller, etc errors
                        resolve({ status: -2.06 })
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                      resolve({ status: -2.05 })
                    })
                } else {
                  //key has already been added
                  resolve({ status: -2.04 })
                }
              })
              .catch((error) => {
                console.log(error)
                resolve({ status: -2.03 })
              })
          } else {
            //key is not a publickey
            resolve({ status: -2.2 })
          }
        } else {
          //there was an error or DID does not exist
          resolve({ status: -2.01 })
        }
      })
      .catch((error) => {
        resolve({ status: -22 })
      })
  })
}

function addKeyCore(address, key, purp) {
  return new Promise(function (resolve, reject) {
    return did
      .addKey(address, key, purp)
      .then((rAddKey) => {
        resolve({ status: 1 })
      })
      .catch((error) => {
        console.log('ERROR', error)
        resolve({ status: -4.0 })
      })
  })
}

function checkPublicKey(key) {
  //if string can generate an address, string is a public key
  try {
    key = '0x'+key
    let address = ethers.utils.computeAddress(key)
    let x = checkAddress(address)
    return x
  } catch {
    return false
  }
}

function getKeys(address) {
  return new Promise(function (resolve, reject) {
    let addressOK = checkAddress(address)
    if (addressOK === true) {
      return getKeysCore(address)
        .then((rGetKeys) => {
          let keys = rGetKeys.rGetKeys
          pubKeys = []
          for (let i = 0; i < keys.length; i++) {
            let pem = '0x' + keys[i][0].toString('hex')
            pubKeys.push(pem)
          }
          resolve({ pubKeys })
        })
        .catch((error) => {
          console.log(error)
          resolve({ status: -3.02 })
        })
    } else {
      resolve({ status: -3.03 })
    }
  })
}

function getKeysCore(address) {
  return new Promise(function (resolve, reject) {
    return did
      .getKeys(address)
      .then((rGetKeys) => {
        resolve({ rGetKeys })
      })
      .catch((error) => {
        resolve({ status: -2.0022 })
      })
  })
}

function checkAddress(address) {
  if (typeof address === 'string') {
    return ethers.utils.isAddress(address)
  } else {
    return false
  }
}

async function checkNetCore() {
  return new Promise(async function (resolve, reject) {
    return did.provider
      .getBlock(5)
      .then((r) => {
        if (r.timestamp > 1000) {
          resolve(1)
        } else {
          resolve(-1.001 )
        }
      })
      .catch((error) => {
        resolve(-1.002 )
      })
  })
}

function checkNet() {
  return checkNetCore()
    .then((r) => {
      return r
    })
    .catch((error) => {
      return 0
    })
}

// key input is on bufferArrayVar
// we pass it to string with prefix[0x] to compare with the rest of the keys
function checkKeyAlreadyExist(key, keyArr) {
  key = '0x'+key.toString('hex')
  var keyExist = keyArr.includes(key)
  return keyExist
}

function returnNoNetAux(res) {
  let msg = { status: -200 }
  msg = JSON.stringify({ msg })
  return res.status(200).send({ msg })
}

function returnCatchErr(res) {
  let msg = { status: -100 }
  msg = JSON.stringify({ msg })
  return res.status(200).send({ msg })
}

function wrongSigner(res) {
  let msg = { status: -300 }
  msg = JSON.stringify({ msg })
  return res.status(200).send({ msg })
}

function unexpectedError(res){
  let msg = { status: -400 }
  msg = JSON.stringify({ msg })
  return res.status(200).send({ msg })
}

module.exports = {
  returnMessageSigner,
  getController,
  createDID,
  checkAddress,
  checkNet,
  wrongSigner,
  returnNoNetAux,
  returnCatchErr,
  unexpectedError,
  addKey,
  getDIDDocument,
  removeKey,
}

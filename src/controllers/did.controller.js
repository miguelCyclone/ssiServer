// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// This is the controler script, the functions are called by the did.routes
//

const did = require('../utils/didLib.aux')
const eccrypto = require('eccrypto')

exports.createDid = async function (req, res, next) {
  try {
    let x = await did.checkNet()
    if (x === 1) {
      let signer = did.returnMessageSigner(
        req.body.verifyMessage.rawMessage,
        req.body.verifyMessage.signedMessage,
      )
      let bodyObj = JSON.parse(req.body.verifyMessage.rawMessage)
      let didAddress = bodyObj.did
      if (didAddress.toUpperCase() === signer.toUpperCase()) {
        return did
          .createDID(didAddress)
          .then((answer) => {
            let msg = { status: answer.status }
            msg = JSON.stringify({ msg })
            return res.status(200).send({ msg })
          })
          .catch((error) => {
            return did.returnCatchErr(res)
          })
      } else {
        return did.wrongSigner(res)
      }
    } else {
      return did.returnNoNetAux(res)
    }
  } catch (err) {
    return did.unexpectedError(res)
  }
}

exports.getController = async function (req, res, next) {
  try {
    let x = await did.checkNet()
    if (x === 1) {
      let didAddress = req.body.did
      return did
        .getController(didAddress)
        .then((answer) => {
          let msg = ''
          if (answer.status === 1) {
            msg = { status: 1, controler: answer }
          }
          if (answer.status === 0) {
            msg = { status: 0, controler: 'No controller' }
          }
          if (answer.status !== 1 && answer.status !== 0) {
            msg = {
              status: -1,
              controler: 'There was an error: ' + answer.status,
            }
          }
          msg = JSON.stringify({ msg })
          return res.status(200).send({ msg })
        })
        .catch((error) => {
          return did.returnCatchErr(res)
        })
    } else {
      return did.returnNoNetAux(res)
    }
  } catch (err) {
    return did.unexpectedError(res)
  }
}

// key variable must be the public key in string format withouth the '0x'
// Example: 0411ec8482f280815bf33a7161376fcac4ad966a3fd10e4c0e926d74d4aeb19142a506b60a79001e157d459ecd167930f4fbb6974fb82f9609a400217476dad625
exports.addKey = async function (req, res, next) {
  try {
    let x = await did.checkNet()
    //
    if (x === 1) {
      let signer = did.returnMessageSigner(
        req.body.verifyMessage.rawMessage,
        req.body.verifyMessage.signedMessage,
      )
      let bodyObj = JSON.parse(req.body.verifyMessage.rawMessage)
      let didAddress = bodyObj.did
      if (didAddress.toUpperCase() === signer.toUpperCase()) {
        let key = bodyObj.key //convert key to buffer byetarr
        let purp = bodyObj.purp
        return did
          .addKey(didAddress, key, purp)
          .then((answer) => {
            let msg = { status: answer.status }
            msg = JSON.stringify({ msg })
            return res.status(200).send({ msg })
          })
          .catch((error) => {
            return did.returnCatchErr(res)
          })
      } else {
        return did.wrongSigner(res)
      }
    } else {
      return did.returnNoNetAux(res)
    }
  } catch (err) {
    return did.unexpectedError(res)
  }
}

exports.removeKey = async function (req, res, next) {
  try {
    let x = await did.checkNet()
    if (x === 1) {
      let signer = did.returnMessageSigner(
        req.body.verifyMessage.rawMessage,
        req.body.verifyMessage.signedMessage,
      )
      let bodyObj = JSON.parse(req.body.verifyMessage.rawMessage)
      let didAddress = bodyObj.did
      if (didAddress.toUpperCase() === signer.toUpperCase()) {
        let index = bodyObj.index
        return did
          .removeKey(didAddress, index)
          .then((answer) => {
            let msg = { status: answer.status }
            msg = JSON.stringify({ msg })
            return res.status(200).send({ msg })
          })
          .catch((error) => {
            return did.returnCatchErr(res)
          })
      } else {
        return did.wrongSigner(res)
      }
    } else {
      return did.returnNoNetAux(res)
    }
  } catch (err) {
    return did.unexpectedError(res)
  }
}

exports.getDIDDocument = async function (req, res, next) {
  try {
    let x = await did.checkNet()
    if (x === 1) {
      let didMethod = req.body.didMethod
      return did
        .getDIDDocument(didMethod)
        .then((answer) => {
          let msg = { status: answer.status, didDoc: answer.didDoc }
          msg = JSON.stringify({ msg })
          return res.status(200).send({ msg })
        })
        .catch((error) => {
          return did.returnCatchErr(res)
        })
    } else {
      return did.returnNoNetAux(res)
    }
  } catch (err) {
    return did.unexpectedError(res)
  }
}

//for testing
/*
function generateKeys() {
  let privKey = eccrypto.generatePrivate()
  let pubKey = eccrypto.getPublic(privKey) //user saves this? is it linked to the mnemonic?
  return pubKey
}

function typeOf(obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}
*/

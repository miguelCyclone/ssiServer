// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//
// From the main route script we come to this script to define the function route
//

const express = require("express");
const router = express.Router();
const did = require("../controllers/did.controller");

router.post("/createDid", did.createDid);
router.post("/getController", did.getController);
router.post("/addKey", did.addKey);
router.post("/removeKey", did.removeKey);
router.post("/getDIDDocument", did.getDIDDocument);

module.exports = router;
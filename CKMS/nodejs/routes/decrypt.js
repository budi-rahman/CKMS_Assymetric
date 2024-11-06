const express = require('express');
const router = express.Router();
const DecryptionController = require('../controllers/decryptControllers')
// const DecryptionControllerAlt = require('../controllers/decryptControllersAlt')

router.post('/', DecryptionController.decryptData);
// router.post('/', DecryptionControllerAlt.decryptDataAlt);

module.exports = router;
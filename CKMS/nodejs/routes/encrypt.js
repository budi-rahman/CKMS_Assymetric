const express = require('express');
const router = express.Router();
const EncryptionController = require('../controllers/encryptControllers');
//const EncryptionControllerAlt = require('../controllers/encryptControllersAlt');

router.post('/', EncryptionController.encryptData);
//router.post('/', EncryptionControllerAlt.encryptDataAlt);

module.exports = router;
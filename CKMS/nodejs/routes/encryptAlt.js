const express = require('express');
const router = express.Router();
const EncryptionControllerAlt = require('../controllers/encryptControllersAlt');

router.post('/', EncryptionControllerAlt.encryptDataAlt);

module.exports = router;



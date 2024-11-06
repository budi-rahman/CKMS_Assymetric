const express = require('express');
const router = express.Router();
const DecryptionControllerAlt = require('../controllers/decryptControllersAlt');

router.post('/', DecryptionControllerAlt.decryptDataAlt);

module.exports = router;


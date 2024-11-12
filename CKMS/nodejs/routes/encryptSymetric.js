const express = require('express');
const router = express.Router();
const encryptSymetricCtrl = require('../controllers/encryptSymetricCrtl');

router.post('/', encryptSymetricCtrl.encryptSymetric);

module.exports = router;

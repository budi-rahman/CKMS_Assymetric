const express = require('express');
const router = express.Router();
const keySymetricCtrl = require('../controllers/keySymetricCtrl');

router.post('/', keySymetricCtrl.generateSymetricKey);

module.exports = router;

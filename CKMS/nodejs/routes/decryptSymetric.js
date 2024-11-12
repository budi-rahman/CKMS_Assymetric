const express = require('express');
const router = express.Router();
const decryptSymetricCtrl = require('../controllers/decryptSymtericCtrl');

router.post('/', decryptSymetricCtrl.decryptSymetric);

module.exports = router;
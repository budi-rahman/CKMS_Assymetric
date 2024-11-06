const express = require('express');
const router = express.Router();
const keyGenerateControllerAlt = require('../controllers/keyControllersAlt');

router.post('/', keyGenerateControllerAlt.generateKeyAlt);

module.exports = router;


const express = require('express')
const router = express.Router()
const keyGenerateController = require('../controllers/keyControllers');
// const keyGenerateControllerAlt = require('../controllers/keyControllersAlt');

router.post('/', keyGenerateController.keyGenerate);
//router.post('/', keyGenerateControllerAlt.generateKeyAlt);

module.exports = router
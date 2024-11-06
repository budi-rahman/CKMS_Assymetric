const express = require('express')
const router = express.Router()
const authRouter = require('./auth')
const { authenticate } = require('../middleware/auth')
//const keyRouter = require('./key')
const keyRouterAlt = require('./keygenAlt')
//const encryptRouter = require('./encrypt')
const encryptRouterAlt = require('./encryptAlt')
//const decryptRouter = require('./decrypt')
const decryptRouterAlt = require('./decryptAlt')

router.get('/welcome', (req, res) => {
    res.send('Hello World')
})

router.use('/', authRouter)
//router.use(authenticate)
//router.use('/generate', keyRouter)
router.use('/generateAlt', keyRouterAlt)
//router.use('/encrypt', encryptRouter)
router.use('/encryptAlt', encryptRouterAlt)
//router.use('/decrypt', decryptRouter)
router.use('/decryptAlt', decryptRouterAlt)


module.exports = router
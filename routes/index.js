const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const record = require('./modules/record')
const home = require('./modules/home')
const user = require('./modules/user')

router.use('/user', user)
router.use('/record', authenticator, record)
router.use('/', authenticator, home)
router.use('/', generalErrorHandler)

module.exports = router
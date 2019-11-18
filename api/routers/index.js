var express = require('express');
const router = express.Router()

router.use('/todo', require('./Todo'))

module.exports = router;

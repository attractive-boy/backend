const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/uniLogin', login);

module.exports = router; 
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// 获取当前登录用户信息
router.get('/user/current', verifyToken, UserController.getCurrentUser);

// 上传头像
router.post('/user/avatar', verifyToken, UserController.uploadAvatar);

module.exports = router; 
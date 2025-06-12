const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const { verifyToken } = require('../middleware/auth');

// 获取班级详情
router.get('/class/:classId', verifyToken, ClassController.getClassDetail);

module.exports = router; 
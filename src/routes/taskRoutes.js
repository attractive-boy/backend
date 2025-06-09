const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

// 获取任务列表
router.get('/task/list', verifyToken, TaskController.getTaskList);

module.exports = router; 
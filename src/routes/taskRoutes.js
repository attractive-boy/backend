const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

// 获取任务列表
router.get('/task/list', verifyToken, TaskController.getTaskList);

// 获取任务详情
router.get('/task/detail', verifyToken, TaskController.getTaskDetail);

// 开启任务
router.post('/task/start', verifyToken, TaskController.startTask);

// 保存评分
router.post('/task/score', verifyToken, TaskController.saveScore);

module.exports = router; 
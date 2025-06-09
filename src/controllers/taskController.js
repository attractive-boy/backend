const Task = require('../models/Task');

class TaskController {
  // 获取任务列表
  static async getTaskList(req, res) {
    try {
      const tasks = await Task.query()
        .orderBy('createdAt', 'desc');
      
      res.json({
        code: 0,
        msg: '获取成功',
        data: tasks
      });
    } catch (error) {
      console.error('获取任务列表失败:', error);
      res.status(500).json({
        code: 500,
        msg: '获取任务列表失败',
        data: null
      });
    }
  }
}

module.exports = TaskController; 
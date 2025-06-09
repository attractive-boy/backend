const User = require('../models/User');

class UserController {
  static async getCurrentUser(req, res) {
    try {
      // 从认证中间件中获取用户ID
      const userId = req.user.id;
      
      // 查询用户信息，排除密码字段
      const user = await User.query()
        .findById(userId)
        .select('id', 'username', 'name', 'role', 'createdAt', 'updatedAt');
      
      if (!user) {
        return res.status(404).json({ message: '用户不存在' });
      }

      res.json({
        code: 0,
        data: user,
        message: '获取成功'
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
}

module.exports = UserController;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查JWT密钥是否配置
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET 未配置');
      return res.status(500).json({
        code: 500,
        msg: '服务器配置错误',
        data: null
      });
    }

    // 查找用户
    const user = await User.query().where('username', username).first();
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误',
        data: null
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误',
        data: null
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET
    );

    res.json({
      code: 0,
      msg: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      code: 500,
      msg: '服务器错误',
      data: null
    });
  }
};

module.exports = {
  login
}; 
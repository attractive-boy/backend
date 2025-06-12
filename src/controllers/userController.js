const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 生成文件名：时间戳 + 随机数 + 原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许上传图片
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('只允许上传图片文件！'));
    }
    cb(null, true);
  }
}).single('file');

class UserController {
  static async getCurrentUser(req, res) {
    try {
      // 从认证中间件中获取用户ID
      const userId = req.user.id;
      
      // 查询用户信息，排除密码字段
      const user = await User.query()
        .findById(userId)
        .select('id', 'username', 'name', 'role', 'avatar', 'createdAt', 'updatedAt');
      
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

  // 上传头像
  static async uploadAvatar(req, res) {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          code: 400,
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: '请选择要上传的文件'
        });
      }

      try {
        const userId = req.user.id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        // 更新用户头像
        await User.query()
          .findById(userId)
          .patch({
            avatar: avatarPath
          });

        res.json({
          code: 200,
          data: avatarPath,
          message: '头像上传成功'
        });
      } catch (error) {
        console.error('上传头像失败:', error);
        res.status(500).json({
          code: 500,
          message: '服务器错误'
        });
      }
    });
  }
}

module.exports = UserController;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 从 Authorization header 中获取 token
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      msg: '未提供token或token格式错误',
      data: null
    });
  }

  // 提取 token
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      msg: 'token无效或已过期',
      data: null
    });
  }
};

module.exports = {
  verifyToken
}; 
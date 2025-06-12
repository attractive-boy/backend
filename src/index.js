require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('../knexfile');
const { Model } = require('objection');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const cozeRoutes = require('./routes/cozeRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 初始化数据库连接
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(db);

// 中间件
app.use(cors());
app.use(express.json());

// 配置静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', userRoutes);
app.use('/api', classRoutes);
app.use('/api/coze', cozeRoutes);

//健康检查
app.get('/health', (req, res) => {
  console.log('Health check endpoint accessed');
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 
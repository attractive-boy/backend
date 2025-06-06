require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('../knexfile');
const { Model } = require('objection');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 初始化数据库连接
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(db);

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', authRoutes);

//健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
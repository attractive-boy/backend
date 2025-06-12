const express = require('express');
const router = express.Router();
const {
  getAllCozeConfigs,
  getCozeConfigById,
  createCozeConfig,
  updateCozeConfig,
  deleteCozeConfig
} = require('../controllers/cozeController');

// 获取所有 Coze 配置
router.get('/configs', getAllCozeConfigs);

// 获取单个 Coze 配置
router.get('/configs/:id', getCozeConfigById);

// 创建新的 Coze 配置
router.post('/configs', createCozeConfig);

// 更新 Coze 配置
router.put('/configs/:id', updateCozeConfig);

// 删除 Coze 配置
router.delete('/configs/:id', deleteCozeConfig);

module.exports = router; 
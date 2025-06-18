const CozeConfig = require('../models/CozeConfig');
const Prompt = require('../models/Prompt');

// 获取所有 Coze 配置
const getAllCozeConfigs = async (req, res) => {
  try {
    const configs = await CozeConfig.query()
      .where('isActive', true)
      .orderBy('createdAt', 'desc');
      
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取 Coze 配置失败',
      error: error.message
    });
  }
};

// 获取单个 Coze 配置
const getCozeConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    const config = await CozeConfig.query()
      .findById(id);

    if (!config) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的 Coze 配置'
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取 Coze 配置失败',
      error: error.message
    });
  }
};

// 创建新的 Coze 配置
const createCozeConfig = async (req, res) => {
  try {
    const { token, botId } = req.body;
    
    const config = await CozeConfig.query()
      .insert({
        token,
        botId,
        isActive: true
      });

    res.status(201).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建 Coze 配置失败',
      error: error.message
    });
  }
};

// 更新 Coze 配置
const updateCozeConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, botId, isActive } = req.body;

    const config = await CozeConfig.query()
      .patchAndFetchById(id, {
        token,
        botId,
        isActive
      });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的 Coze 配置'
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新 Coze 配置失败',
      error: error.message
    });
  }
};

// 删除 Coze 配置
const deleteCozeConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await CozeConfig.query()
      .deleteById(id);

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的 Coze 配置'
      });
    }

    res.json({
      success: true,
      message: 'Coze 配置已成功删除'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除 Coze 配置失败',
      error: error.message
    });
  }
};

// 获取课堂点评提示词
const getPromptSummary = async (req, res) => {
  try {
    // 从数据库获取类型为'summary'的提示词
    const prompt = await Prompt.query()
      .where('type', 'summary')
      .where('isActive', true)
      .orderBy('createdAt', 'desc')
      .first();

    if (!prompt) {
      // 如果没有找到提示词，返回默认提示词
      const defaultPrompt = ``;

      // 创建默认提示词
      await Prompt.query().insert({
        type: 'summary',
        content: defaultPrompt,
        isActive: true
      });

      return res.json({
        code: 0,
        data: defaultPrompt
      });
    }

    res.json({
      code: 0,
      data: prompt.content
    });
  } catch (error) {
    res.status(500).json({
      code: 1,
      message: '获取提示词失败',
      error: error.message
    });
  }
};

module.exports = {
  getAllCozeConfigs,
  getCozeConfigById,
  createCozeConfig,
  updateCozeConfig,
  deleteCozeConfig,
  getPromptSummary
}; 
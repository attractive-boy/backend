const Class = require('../models/Class');
const { Model } = require('objection');

class ClassController {
  // 获取班级详情
  static async getClassDetail(req, res) {
    try {
      const { classId } = req.params;
      const currentUser = req.user;

      // 获取当前用户所在班级
      const userClasses = await Model.knex()
        .from('_classtouser')
        .where('B', currentUser.id)
        .select('A');

      if (!userClasses || userClasses.length === 0) {
        return res.json({
          code: 1,
          msg: '用户未加入任何班级',
          data: null
        });
      }

      const classIds = userClasses.map(uc => uc.A);

      // 检查用户是否有权限访问该班级
      if (!classIds.includes(parseInt(classId))) {
        return res.json({
          code: 1,
          msg: '无权限访问该班级',
          data: null
        });
      }

      // 查询班级详情，包括关联的用户和任务
      const classDetail = await Class.query()
        .findById(classId)
        .withGraphFetched('[users, tasks]')
        .modifyGraph('users', builder => {
          builder.select('id', 'username', 'name', 'role');
        });

      if (!classDetail) {
        return res.json({
          code: 1,
          msg: '班级不存在',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '获取成功',
        data: classDetail
      });
    } catch (error) {
      console.error('获取班级详情失败:', error);
      res.status(500).json({
        code: 500,
        msg: '获取班级详情失败',
        data: null
      });
    }
  }
}

module.exports = ClassController; 
const Task = require('../models/Task');
const User = require('../models/User');
const Score = require('../models/Score');
const { Model } = require('objection');

class TaskController {
  // 获取任务列表
  static async getTaskList(req, res) {
    try {
      // 获取当前用户信息
      const currentUser = req.user;
      console.log('当前用户信息:', currentUser);
      
      // 获取当前用户所在班级
      const userClasses = await Model.knex()
        .from('_classtouser')
        .where('B', currentUser.id)  // B 字段存储用户ID
        .select('A');  // A 字段存储班级ID
      
      if (!userClasses || userClasses.length === 0) {
        return res.json({
          code: 0,
          msg: '用户未加入任何班级',
          data: []
        });
      }

      const classIds = userClasses.map(uc => uc.A);
      console.log('当前用户所在班级:', classIds);

      // 获取当前用户所在班级下的所有任务
      const tasks = await Task.query()
        .whereIn('classId', classIds)
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

  // 获取任务详情
  static async getTaskDetail(req, res) {
    try {
      const { id } = req.query;
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

      // 查询任务详情
      const task = await Task.query()
        .where('id', id)
        .whereIn('classId', classIds)
        .first();

      if (!task) {
        return res.json({
          code: 1,
          msg: '任务不存在或无权限查看',
          data: null
        });
      }

      res.json({
        code: 0,
        msg: '获取成功',
        data: task
      });
    } catch (error) {
      console.error('获取任务详情失败:', error);
      res.status(500).json({
        code: 500,
        msg: '获取任务详情失败',
        data: null
      });
    }
  }

  // 开启任务并初始化学生分数
  static async startTask(req, res) {
    try {
      const { taskId } = req.body;
      
      // 验证 taskId 是否存在
      if (!taskId) {
        return res.json({
          code: 1,
          msg: '任务ID不能为空',
          data: null
        });
      }

      const currentUser = req.user;
      console.log('当前用户信息:', currentUser);

      // 获取任务信息
      const taskQuery = Task.query()
        .findById(taskId)
        .withGraphFetched('class');
      
      console.log('任务查询SQL:', taskQuery.toKnexQuery().toString());
      const task = await taskQuery;

      if (!task) {
        return res.json({
          code: 1,
          msg: '任务不存在',
          data: null
        });
      }

      console.log('任务信息:', task);
      console.log('班级ID:', task.classId);

      // 获取班级中的所有学生
      const studentsQuery = Model.knex()
        .from('student')
        .where('classId', task.classId)
        .select('id as studentId', 'name');

      console.log('学生信息查询SQL:', studentsQuery.toString());
      const students = await studentsQuery;

      console.log('查询到的学生信息:', students);

      if (!students || students.length === 0) {
        console.log('班级中没有学生');
        return res.json({
          code: 1,
          msg: '班级中没有学生',
          data: null
        });
      }

      // 检查是否已经存在该任务的分数记录
      const existingScoresQuery = Score.query()
        .where('taskId', taskId)
        .select('*');

      console.log('现有分数查询SQL:', existingScoresQuery.toString());
      const existingScores = await existingScoresQuery;

      console.log('现有分数记录:', existingScores);

      let scoreRecords = [];

      if (existingScores && existingScores.length > 0) {
        // 找出新加入的学生（没有分数记录的学生）
        const existingStudentIds = existingScores.map(score => score.studentId);
        const newStudents = students.filter(student => !existingStudentIds.includes(student.studentId));

        console.log('新加入的学生:', newStudents);

        // 为新加入的学生创建分数记录
        if (newStudents.length > 0) {
          const newScoreRecords = newStudents.map(student => ({
            taskId: parseInt(taskId),
            studentId: student.studentId,
            teacherScore: 0,
            studentScore: 0,
            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
          }));

          console.log('准备插入的新分数记录:', newScoreRecords);
          console.log('插入新分数SQL:', Model.knex('score').insert(newScoreRecords).toString());

          await Model.knex('score').insert(newScoreRecords);
          scoreRecords = [...existingScores, ...newScoreRecords];
        } else {
          scoreRecords = existingScores;
        }
      } else {
        // 为所有学生创建初始分数记录
        scoreRecords = students.map(student => ({
          taskId: parseInt(taskId),
          studentId: student.studentId,
          teacherScore: 0,
          studentScore: 0,
          createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }));

        console.log('准备插入的初始分数记录:', scoreRecords);


        await Score.query().insert(scoreRecords);
      }

      // 构建返回的分数记录
      const scoreDetails = scoreRecords.map(score => {
        const student = students.find(s => s.studentId === score.studentId);
        return {
          studentId: student.studentId,
          name: student.name,
          teacherScore: score.teacherScore,
          studentScore: score.studentScore,
          score: score.teacherScore + score.studentScore
        };
      });

      res.json({
        code: 0,
        msg: '任务开启成功',
        data: {
          taskId,
          studentCount: students.length,
          scores: scoreDetails
        }
      });
    } catch (error) {
      console.error('开启任务失败:', error);
      res.status(500).json({
        code: 500,
        msg: '开启任务失败',
        data: null
      });
    }
  }

  // 保存评分
  static async saveScore(req, res) {
    try {
      const { taskId, studentId, teacherScore, studentScore } = req.body;
      
      // 验证必要参数
      if (!taskId || !studentId || teacherScore === undefined || studentScore === undefined) {
        return res.json({
          code: 1,
          msg: '缺少必要参数',
          data: null
        });
      }

      // 获取当前用户信息
      const currentUser = req.user;

      // 获取任务信息
      const task = await Task.query()
        .findById(taskId)
        .withGraphFetched('class');

      if (!task) {
        return res.json({
          code: 1,
          msg: '任务不存在',
          data: null
        });
      }

      // 更新或创建分数记录
      const score = await Score.query()
        .where({
          taskId: taskId,
          studentId: studentId
        })
        .first();

      if (score) {
        // 更新现有分数
        await Score.query()
          .patch({
            teacherScore: teacherScore,
            studentScore: studentScore,
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
          })
          .where({
            taskId: taskId,
            studentId: studentId
          });
      } else {
        // 创建新分数记录
        await Score.query().insert({
          taskId: taskId,
          studentId: studentId,
          teacherScore: teacherScore,
          studentScore: studentScore,
          createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
      }

      res.json({
        code: 0,
        msg: '评分保存成功',
        data: null
      });
    } catch (error) {
      console.error('保存评分失败:', error);
      res.status(500).json({
        code: 500,
        msg: '保存评分失败',
        data: null
      });
    }
  }
}

module.exports = TaskController; 
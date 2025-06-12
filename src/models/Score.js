const { Model } = require('objection');

class Score extends Model {
  static get tableName() {
    return 'score';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'studentId', 'teacherScore', 'studentScore'],

      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer' },
        studentId: { type: 'integer' },
        teacherScore: { type: 'integer' },
        studentScore: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  // 定义关系
  static get relationMappings() {
    const Task = require('./Task');
    const Student = require('./Student');

    return {
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: 'score.taskId',
          to: 'task.id'
        }
      },
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Student,
        join: {
          from: 'score.studentId',
          to: 'student.id'
        }
      }
    };
  }
}

module.exports = Score; 
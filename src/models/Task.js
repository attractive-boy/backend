const { Model } = require('objection');

class Task extends Model {
  static get tableName() {
    return 'task';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'content', 'classId'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        content: { type: 'string' },
        classId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  // 定义关系
  static get relationMappings() {
    const Class = require('./Class');
    const Evaluation = require('./Evaluation');

    return {
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Class,
        join: {
          from: 'task.classId',
          to: 'class.id'
        }
      },
      evaluations: {
        relation: Model.HasManyRelation,
        modelClass: Evaluation,
        join: {
          from: 'task.id',
          to: 'evaluation.taskId'
        }
      }
    };
  }
}

module.exports = Task;
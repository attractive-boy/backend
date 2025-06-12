const { Model } = require('objection');

class Evaluation extends Model {
  static get tableName() {
    return 'evaluation';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'userId'],

      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer' },
        userId: { type: 'integer' },
        summary: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  // 定义关系
  static get relationMappings() {
    const Task = require('./Task');
    const User = require('./User');
    const Score = require('./Score');

    return {
      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: 'evaluation.taskId',
          to: 'task.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'evaluation.userId',
          to: 'user.id'
        }
      },
      scores: {
        relation: Model.HasManyRelation,
        modelClass: Score,
        join: {
          from: 'evaluation.id',
          to: 'score.evaluationId'
        }
      }
    };
  }
}

module.exports = Evaluation; 
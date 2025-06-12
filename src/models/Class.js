const { Model } = require('objection');

class Class extends Model {
  static get tableName() {
    return 'class';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  // 定义关系
  static get relationMappings() {
    const User = require('./User');
    const Task = require('./Task');

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'class.id',
          through: {
            from: '_classtouser.A',
            to: '_classtouser.B'
          },
          to: 'user.id'
        }
      },
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'class.id',
          to: 'task.classId'
        }
      }
    };
  }
}

module.exports = Class; 
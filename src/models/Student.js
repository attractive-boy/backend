const { Model } = require('objection');

class Student extends Model {
  static get tableName() {
    return 'student';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'classId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        category: { type: ['string', 'null'] },
        classId: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  // 定义关系
  static get relationMappings() {
    const Class = require('./Class');
    const Score = require('./Score');

    return {
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Class,
        join: {
          from: 'student.classId',
          to: 'class.id'
        }
      },
      scores: {
        relation: Model.HasManyRelation,
        modelClass: Score,
        join: {
          from: 'student.id',
          to: 'score.studentId'
        }
      }
    };
  }
}

module.exports = Student; 
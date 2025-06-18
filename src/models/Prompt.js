const { Model } = require('objection');

class Prompt extends Model {
  static get tableName() {
    return 'prompts';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type', 'content'],

      properties: {
        id: { type: 'integer' },
        type: { type: 'string', minLength: 1, maxLength: 50 },
        content: { type: 'string' },
        isActive: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Prompt; 
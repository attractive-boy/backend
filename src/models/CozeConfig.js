const { Model } = require('objection');

class CozeConfig extends Model {
  static get tableName() {
    return 'coze_config';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['token', 'botId'],
      properties: {
        id: { type: 'integer' },
        token: { type: 'string', minLength: 1 },
        botId: { type: 'string', minLength: 1 },
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

module.exports = CozeConfig; 
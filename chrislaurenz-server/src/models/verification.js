/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('verification', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.ENUM('A','R','O'),
      allowNull: false
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    tableName: 'verification'
  });
};

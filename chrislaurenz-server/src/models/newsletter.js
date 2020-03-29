/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('newsletter', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      token: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      gender: {
        type: DataTypes.ENUM('M','F','U'),
        allowNull: false
      },
      is_activ: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '0'
      },
      creation_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn('current_timestamp')
      }
    }, {
      tableName: 'newsletter'
    });
  };
  
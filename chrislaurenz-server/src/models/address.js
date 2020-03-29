/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    street_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'address'
  });
};

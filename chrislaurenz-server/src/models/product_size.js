/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_size', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_int: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_eu: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_us: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_uk: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_fr: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    value_it: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    details: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'product_size'
  });
};

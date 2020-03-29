/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_picture', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    file: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    product_variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'product_variant',
        key: 'id'
      }
    }
  }, {
    tableName: 'product_picture'
  });
};

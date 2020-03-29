/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_has_customer_order', {
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    customer_order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'customer_order',
        key: 'id'
      }
    },
    product_order_quantity: {
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
    },
    product_size_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product_size',
        key: 'id'
      }
    },
    product_order_comment: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'product_has_customer_order'
  });
};

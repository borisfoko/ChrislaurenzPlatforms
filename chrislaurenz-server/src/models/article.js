/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('article', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('defect','sold','available'),
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    supplier_invoice_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'supplier_invoice',
        key: 'id'
      }
    },
    supplier_delivery_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'supplier_delivery',
        key: 'id'
      }
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
    customer_order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'customer_order',
        key: 'id'
      }
    }
  }, {
    tableName: 'article'
  });
};

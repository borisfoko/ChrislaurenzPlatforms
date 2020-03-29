/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    supplier_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sale_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    short_details: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product_type',
        key: 'id'
      }
    },
    supplier_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'supplier',
        key: 'id'
      }
    },
    product_group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product_group',
        key: 'id'
      }
    },
    product_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product_category',
        key: 'id'
      }
    },
    product_collection_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product_collection',
        key: 'id'
      }
    }
  }, {
    tableName: 'product'
  });
};

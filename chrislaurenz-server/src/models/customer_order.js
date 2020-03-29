/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_order', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','done','canceled'),
      allowNull: true
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    customer_order_invoice_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'customer_order_invoice',
        key: 'id'
      }
    }
  }, {
    tableName: 'customer_order'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_payment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    customer_payment_method_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'customer_payment_method',
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
    tableName: 'customer_payment'
  });
};

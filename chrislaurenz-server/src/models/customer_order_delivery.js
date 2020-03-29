/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_order_delivery', {
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
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','shipped','delivered','abort','canceled'),
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'customer_order',
        key: 'id'
      }
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'customer_order_delivery'
  });
};

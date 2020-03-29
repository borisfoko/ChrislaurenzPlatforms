/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_payment_method', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    }
  }, {
    tableName: 'customer_payment_method'
  });
};

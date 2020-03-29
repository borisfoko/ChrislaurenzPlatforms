/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_delivery', {
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
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    noa: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    supplier_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'supplier',
        key: 'id'
      }
    }
  }, {
    tableName: 'supplier_delivery'
  });
};

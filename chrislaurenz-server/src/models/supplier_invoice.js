/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_invoice', {
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paid_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: '0'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','processed','done','canceled'),
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
    tableName: 'supplier_invoice'
  });
};

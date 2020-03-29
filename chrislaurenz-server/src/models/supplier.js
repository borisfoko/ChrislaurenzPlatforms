/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier', {
    id: {
      type: DataTypes.INTEGER(11),
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
    contract_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    tel_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      }
    }
  }, {
    tableName: 'supplier'
  });
};

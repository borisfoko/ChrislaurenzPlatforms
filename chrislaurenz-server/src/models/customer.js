/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    invoice_address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      }
    },
    delivery_address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'address',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    tableName: 'customer'
  });
};

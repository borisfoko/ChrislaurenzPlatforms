/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_category', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    side_picture: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    mega_picture: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    sub_banner_picture: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    theme: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'product_category'
  });
};

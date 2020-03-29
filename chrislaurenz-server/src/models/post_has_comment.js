/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_has_comment', {
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    }
  }, {
    tableName: 'post_has_comment'
  });
};

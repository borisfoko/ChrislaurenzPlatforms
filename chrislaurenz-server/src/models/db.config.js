const fs        = require('fs');
const path      = require('path');
const connection = require('../config/connection.js');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(connection.database, connection.username, connection.password, {
    host: connection.host, 
    dialect: connection.dialect,
    operatorsAliases: false,
    define: {
      timestamps: false
    }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize, Sequelize);
db.role = require('./role')(sequelize, Sequelize);
db.post = require('./post')(sequelize, Sequelize);
db.blog = require('./blog')(sequelize, Sequelize);
db.address = require('./address')(sequelize, Sequelize);
db.article = require('./article')(sequelize, Sequelize);
db.comment = require('./post')(sequelize, Sequelize);
db.newsletter = require('./newsletter')(sequelize, Sequelize);
db.product = require('./product')(sequelize, Sequelize);
db.product_has_customer_order = require('./product_has_customer_order')(sequelize, Sequelize);
db.verification = require('./verification')(sequelize, Sequelize);
db.product_group = require('./product_group')(sequelize, Sequelize);
db.product_size = require('./product_size')(sequelize, Sequelize);
db.product_type = require('./product_type')(sequelize, Sequelize);
db.product_variant = require('./product_variant')(sequelize, Sequelize);
db.product_picture = require('./product_picture')(sequelize, Sequelize);
db.product_category = require('./product_category')(sequelize, Sequelize);
db.product_collection = require('./product_collection')(sequelize, Sequelize);
db.supplier = require('./supplier')(sequelize, Sequelize);
db.supplier_invoice = require('./supplier_invoice')(sequelize, Sequelize);
db.supplier_delivery = require('./supplier_delivery')(sequelize, Sequelize);
db.customer = require('./customer')(sequelize, Sequelize);
db.customer_order = require('./customer_order')(sequelize, Sequelize);
db.customer_payment = require('./customer_payment')(sequelize, Sequelize);
db.customer_payment_method = require('./customer_payment_method')(sequelize, Sequelize);
db.customer_order_invoice = require('./customer_order_invoice')(sequelize, Sequelize);
db.customer_order_delivery = require('./customer_order_delivery')(sequelize, Sequelize);
db.discount = require('./discount')(sequelize, Sequelize);

// Many to Many relationships
db.user.belongsToMany(db.role, {as: 'Roles', through: 'user_has_role', foreignKey: 'user_id', otherKey: 'role_id'});
db.role.belongsToMany(db.user, {as: 'Users', through: 'user_has_role', foreignKey: 'role_id', otherKey: 'user_id'});

db.post.belongsToMany(db.comment, {as: 'Comments', through: 'post_has_comment', foreignKey: 'post_id', otherKey: 'comment_id'});
db.comment.belongsToMany(db.post, {as: 'Posts', through: 'post_has_comment', foreignKey: 'comment_id', otherKey: 'post_id'});

db.product.belongsToMany(db.customer_order, {as: 'Customer_orders', through: 'product_has_customer_order', foreignKey: 'product_id', otherKey: 'customer_order_id'});
db.customer_order.belongsToMany(db.product, {as: 'Products', through: 'product_has_customer_order', foreignKey: 'customer_order_id', otherKey: 'product_id'});

db.product.belongsToMany(db.discount, {as: 'Discounts', through: 'product_has_discount', foreignKey: 'product_id', otherKey: 'discount_id'});
db.discount.belongsToMany(db.product, {as: 'Products', through: 'product_has_discount', foreignKey: 'discount_id', otherKey: 'product_id'});

db.product.belongsToMany(db.product_size, {as: 'Product_sizes', through: 'product_has_product_size', foreignKey: 'product_id', otherKey: 'product_size_id'});
db.product_size.belongsToMany(db.product, {as: 'Products', through: 'product_has_product_size', foreignKey: 'product_size_id', otherKey: 'product_id'});

// One to Many relationships
db.user.hasMany(db.blog, {foreignKey: 'creator_id', targetKey: 'id'});
db.blog.belongsTo(db.user, {foreignKey: 'creator_id', targetKey: 'id'});

db.user.hasMany(db.verification, {foreignKey: 'user_id', targetKey: 'id'});
db.verification.belongsTo(db.user, {foreignKey: 'user_id', targetKey: 'id'});

db.user.hasMany(db.post, {foreignKey: 'creator_id', sourceKey: 'id'});
db.post.belongsTo(db.user, {foreignKey: 'creator_id', targetKey: 'id'});

db.blog.hasMany(db.post, {foreignKey: 'blog_id', targetKey: 'id'});
db.post.belongsTo(db.blog, {foreignKey: 'blog_id', targetKey: 'id'});

db.customer.belongsTo(db.user, {foreignKey: 'user_id', targetKey: 'id'});
db.user.hasMany(db.customer, {foreignKey: 'user_id', targetKey: 'id'});

db.address.hasMany(db.supplier, {as: 'supplier_address', foreignKey: 'address_id', targetKey: 'id'});
db.supplier.belongsTo(db.address, {as: 'supplier_address', foreignKey: 'address_id', targetKey: 'id'});

db.address.hasMany(db.customer, {as: 'invoice_address', foreignKey: 'invoice_address_id', targetKey: 'id'});
db.customer.belongsTo(db.address, {as: 'invoice_address', foreignKey: 'invoice_address_id', targetKey: 'id'});

db.address.hasMany(db.customer, {as: 'delivery_address', foreignKey: 'delivery_address_id', targetKey: 'id'});
db.customer.belongsTo(db.address, {as: 'delivery_address',foreignKey: 'delivery_address_id', targetKey: 'id'});

db.customer.hasMany(db.customer_order, {foreignKey: 'customer_id', targetKey: 'id'});
db.customer_order.belongsTo(db.customer, {foreignKey: 'customer_id', targetKey: 'id'});

db.customer.hasMany(db.customer_payment_method, {foreignKey: 'customer_id', targetKey: 'id'});
db.customer_payment_method.belongsTo(db.customer, {foreignKey: 'customer_id', targetKey: 'id'});

db.customer_payment_method.hasMany(db.customer_payment, {foreignKey: 'customer_payment_method_id', targetKey: 'id'});
db.customer_payment.belongsTo(db.customer_payment_method, {foreignKey: 'customer_payment_method_id', targetKey: 'id'});

db.customer_order_invoice.hasMany(db.customer_order, {foreignKey: 'customer_order_invoice_id', targetKey: 'id'});
db.customer_order.belongsTo(db.customer_order_invoice, {foreignKey: 'customer_order_invoice_id', targetKey: 'id'});

db.customer_order_invoice.hasMany(db.customer_payment, {foreignKey: 'customer_payment_method_id', targetKey: 'id'});
db.customer_payment.belongsTo(db.customer_order_invoice, {foreignKey: 'customer_payment_method_id', targetKey: 'id'});

db.customer_order.hasMany(db.customer_order_delivery, {foreignKey: 'customer_order_id', targetKey: 'id'});
db.customer_order_delivery.belongsTo(db.customer_order, {foreignKey: 'customer_order_id', targetKey: 'id'});

db.supplier.hasMany(db.product, {foreignKey: 'supplier_id', targetKey: 'id'});
db.product.belongsTo(db.supplier, {foreignKey: 'supplier_id', targetKey: 'id'});

db.supplier.hasMany(db.supplier_delivery, {foreignKey: 'supplier_id', targetKey: 'id'});
db.supplier_delivery.belongsTo(db.supplier, {foreignKey: 'supplier_id', targetKey: 'id'});

db.supplier.hasMany(db.supplier_invoice, {foreignKey: 'supplier_id', targetKey: 'id'});
db.supplier_invoice.belongsTo(db.supplier, {foreignKey: 'supplier_id', targetKey: 'id'});

db.supplier_invoice.hasMany(db.article, {foreignKey: 'supplier_invoice_id', targetKey: 'id'});
db.article.belongsTo(db.supplier_invoice, {foreignKey: 'supplier_invoice_id', targetKey: 'id'});

db.supplier_delivery.hasMany(db.article, {foreignKey: 'supplier_delivery_id', targetKey: 'id'});
db.article.belongsTo(db.supplier_delivery, {foreignKey: 'supplier_delivery_id', targetKey: 'id'});

db.product_type.hasMany(db.product, {foreignKey: 'product_type_id', targetKey: 'id'});
db.product.belongsTo(db.product_type, {foreignKey: 'product_type_id', targetKey: 'id'});

db.product_group.hasMany(db.product, {foreignKey: 'product_group_id', targetKey: 'id'});
db.product.belongsTo(db.product_group, {foreignKey: 'product_group_id', targetKey: 'id'});

db.product_category.hasMany(db.product, {foreignKey: 'product_category_id', targetKey: 'id'});
db.product.belongsTo(db.product_category, {foreignKey: 'product_category_id', targetKey: 'id'});

db.product_collection.hasMany(db.product, {foreignKey: 'product_collection_id', targetKey: 'id'});
db.product.belongsTo(db.product_collection, {foreignKey: 'product_collection_id', targetKey: 'id'});

db.product.hasMany(db.article, {foreignKey: 'product_id', targetKey: 'id'});
db.article.belongsTo(db.product, {foreignKey: 'product_id', targetKey: 'id'});

db.product_variant.hasMany(db.article, {foreignKey: 'product_variant_id', targetKey: 'id'});
db.article.belongsTo(db.product_variant, {foreignKey: 'product_variant_id', targetKey: 'id'});

db.product_size.hasMany(db.article, {foreignKey: 'product_size_id', targetKey: 'id'});
db.article.belongsTo(db.product_size, {foreignKey: 'product_size_id', targetKey: 'id'});

db.customer_order.hasMany(db.article, {foreignKey: 'customer_order_id', targetKey: 'id'});
db.article.belongsTo(db.customer_order, {foreignKey: 'customer_order_id', targetKey: 'id'});

db.product.hasMany(db.product_variant, {foreignKey: 'product_id', targetKey: 'id'});
db.product_variant.belongsTo(db.product, {foreignKey: 'product_id', targetKey: 'id'});

db.product_variant.hasMany(db.product_picture, {foreignKey: 'product_variant_id', targetKey: 'id'});
db.product_picture.belongsTo(db.product_variant, {foreignKey: 'product_variant_id', targetKey: 'id'});

module.exports = db;

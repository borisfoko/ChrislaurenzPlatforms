var express = require('express');
var router = express.Router();
var verifySignUp = require('./verifySignUp.js');
var authJwt  = require('./verifyJwtToken.js');
var addressController = require('../controllers/addressController.js');
var userController = require('../controllers/userController.js');
var productController = require('../controllers/productController.js');
var customerController = require('../controllers/customerController.js');
var blogController = require('../controllers/blogController.js');
var newsletterController = require('../controllers/newsletterController.js');
var supplierController = require('../controllers/supplierController.js');


// Signup & Signin
router.post('/auth/signup', [verifySignUp.checkDuplicateEmail], userController.signUp);
router.post('/auth/signin', userController.signIn);
router.post('/auth/verification', userController.verifyIdentity);
router.post('/auth/reset_verification', userController.verifyResetIdentity);
router.post('/auth/reset_email', userController.sendResetPasswordEmail);
router.post('/auth/reset_password', userController.resetPassword);
router.post('/auth/refresh_token', userController.refreshJwtToken);
// Update user
router.put('/user/:id', [authJwt.verifyToken], userController.updateUser);
router.put('/user_password/:id', [authJwt.verifyToken], userController.updatePassword);
// Verrify User roles (rights)
router.get('/board/user', [authJwt.verifyToken], userController.userContent);
router.get('/board/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], userController.managementBoard);
router.get('/board/admin', [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
// Get all users
router.get('/user', [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers);
router.get('/role', [authJwt.verifyToken, authJwt.isAdmin], userController.getAllRoles);
// Add user
router.post('/user', [authJwt.verifyToken, authJwt.isPmOrAdmin, verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], userController.addUser);

// Get products and all related objects as normal user or visitor
router.get('/product', productController.getAllProducts);
router.get('/product_category', productController.getAllProductCategories);
router.get('/product_collection', productController.getAllProductCollections);
router.get('/product_group', productController.getAllProductGroups);
router.get('/product_type', productController.getAllProductTypes);
router.get('/product_size', productController.getAllProductSizes);
router.get('/product_picture', productController.getAllProductPictures);
router.get('/product_variant', productController.getAllProductVariants);
router.get('/article', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.getAllArticles);
router.get('/discount', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.getAllDiscounts);
router.get('/article_product/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.getArticlesByProduct);
// Add products and related objects as admin or pm
router.post('/product', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProduct);
router.post('/product_category', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductCategory);
router.post('/product_collection', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductCollection);
router.post('/product_group', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductGroup);
router.post('/product_type', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductType);
router.post('/product_size', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductSize);
router.post('/product_picture', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductPicture);
router.post('/product_variant', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addProductVariant);
router.post('/article', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addArticle);
router.post('/discount', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.addDiscount);
// Update products and related objects as admin or pm
router.put('/product/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProduct);
router.put('/product_category/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductCategory);
router.put('/product_collection/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductCollection);
router.put('/product_group/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductGroup);
router.put('/product_type/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductType);
router.put('/product_size/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductSize);
router.put('/product_picture/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductPicture);
router.put('/product_variant/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateProductVariant);
router.put('/article/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateArticle);
router.put('/discount/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], productController.updateDiscount);

// Get customers and all related objects as normal user
router.get('/customer_user', [authJwt.verifyToken], customerController.getCustomerByUser);
router.get('/customer_order_user', [authJwt.verifyToken], customerController.getCustomerOrdersByUser);
// Get customers and all related objects as normal pm or admin
router.get('/customer', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomers);
router.get('/customer_payment', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomerPayments);
router.get('/customer_payment_method', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomerPaymentMethods);
router.get('/customer_order', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomerOrders);
router.get('/customer_order_invoice', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomerOrderInvoices);
router.get('/customer_order_delivery', [authJwt.verifyToken, authJwt.isPmOrAdmin], customerController.getAllCustomerOrderDeliveries);
// Add customer 
router.post('/customer', [authJwt.verifyToken], customerController.addCustomer);
router.post('/customer_order_user', [authJwt.verifyToken], customerController.addCustomerOrder);

// Add Address
router.post('/address/:id', [authJwt.verifyToken], addressController.addAddress);
// Get Address
router.get('/address', [authJwt.verifyToken], addressController.getAllAddress);
router.get('/address/:id', [authJwt.verifyToken], addressController.getAddressById);
// Update Address
router.put('/address/:id', [authJwt.verifyToken], addressController.updateAddress);
// Update Address
router.delete('/address/:id', [authJwt.verifyToken], addressController.deleteAddress);

// Get supplier and all related objects as normal pm or admin
router.get('/supplier', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.getAllSuppliers);
// Update suppliers and all related objects
router.put('/supplier/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.updateSupplier);
router.put('/supplier_invoice/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.updateSupplierInvoice);
router.put('/supplier_delivery/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.updateSupplierDelivery);
// add suppliers and all related objects
router.post('/supplier', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.addSupplier);
router.post('/supplier_invoice', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.addSupplierInvoice);
router.post('/supplier_delivery', [authJwt.verifyToken, authJwt.isPmOrAdmin], supplierController.addSupplierDelivery);

// Get blog and all related objects as visitors and normal users
router.get('/blog', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.get('/post', blogController.getAllPosts);
// Update blogs and all related objects as visitors and normal users
router.put('/blog/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], blogController.updateBlog);
router.put('/post/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], blogController.updatePost);
// Delete blog and post
router.delete('/blog/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], blogController.deleteBlog);
router.delete('/post/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], blogController.deletePost);
// Add blogs and all related objects as visitors and normal users
router.post('/blog', [authJwt.verifyToken], blogController.addBlog);
router.post('/post', [authJwt.verifyToken], blogController.addPost);

// Get Post Put and Delete newsletters
router.get('/newsletter', [authJwt.verifyToken, authJwt.isPmOrAdmin], newsletterController.getAllNewsletters)
router.get('/newsletter/:id', [authJwt.verifyToken, authJwt.isPmOrAdmin], newsletterController.getNewsletterById)
router.post('/newsletter', newsletterController.addNewsletterOrEnable)
router.post('/newsletter/disable', newsletterController.disableNewsletter)

module.exports = router;
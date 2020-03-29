const db = require('../models/db.config.js');

var sequelize = db.sequelize;

var User = db.user;
var Product = db.product;
var Product = db.product;
var Address = db.address;
var Customer = db.customer;
var CustomerOrder = db.customer_order;
var ProductHasCustomerOrder = db.product_has_customer_order;
var CustomerOrderDelivery = db.customer_order_delivery;
var CustomerOrderInvoice = db.customer_order_invoice;
var CustomerPayment = db.customer_payment;
var CustomerPaymentMethod = db.customer_payment_method;

// Add customer and all related objects
exports.addCustomer = (req, res) => {
    // Save customer to Database
    return sequelize.transaction(function (t) {
        return Customer.create({
            phone_number: req.body.phoneNumber,
            email: req.body.email,
            invoice_address: req.body.invoiceAddress,
            delivery_address: req.body.deliveryAddress
        }, {
            include: [
                {
                    model: Address,
                    as: 'invoice_address'
                },
                {
                    model: Address,
                    as: 'delivery_address'
                }
            ],
            transaction: t})
            .then((customer) => {
                return User.findOne({
                    where: {
                        number: req.userId
                    }
                }, {transaction: t})
                .then(user => {
                    return customer.setUser(user, {transaction: t});
                });
            });
    }).then(() => {
        res.send("Customer has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Add custimerOrder and all related objects
exports.addCustomerOrder = (req, res) => {
    // Save customerOrder to Database
    return sequelize.transaction(function (t) {
        return CustomerOrder.create({
            date: req.body.date,
            total_price: req.body.totalPrice,
            status: req.body.status,
        }, {
            include: [
                {
                    model: CustomerOrderInvoice,
                    as: 'customer_order_invoice'
                },
                {
                    model: CustomerOrderDelivery,
                    as: 'customer_order_deliveries'
                }
            ],
            transaction: t})
            .then((customerOrder) => {
                return Customer.findOne({
                    where: {
                        user_id: req.userId
                    }
                }, {transaction: t})
                .then(customer => {
                    return customerOrder.setCustomer(customer, {transaction: t});
                });
            })
            .then((customerOrder) => {
                if (!req.body.Products || req.body.Products.length == 0) { 
                    throw "Productlist is empty.";
                }
                return req.body.Products.forEach(function (productElem) {
                    return Product.findOne({
                        where: {
                            id: productElem.id
                        }
                    }, {transaction: t})
                    .then(product => {
                        if (!product) {
                            throw "Product not found.";
                        }
                        return ProductHasCustomerOrder.create(
                            {
                                product_id: productElem.id,
                                customer_order_id: customerOrder.id,
                                product_order_quantity: productElem.product_has_customer_order.product_order_quantity,
                                product_variant_id: productElem.product_has_customer_order.product_variant_id,
                                product_size_id: productElem.product_has_customer_order.product_size_id,
                                product_order_comment: productElem.product_has_customer_order.product_order_comment
                            }, 
                            {transaction: t}
                        );
                    });
                });
            });
    }).then(() => {
        res.send("CustomerOrder has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Customer and all related objects by user
exports.getCustomerByUser = (req, res) => {
    // Get Customer(s) from the Database
    Customer.finOne({
        where: {user_id: req.userId},
        attributes: ['id', 'phone_number', 'email'],
        include: 
        [
            {
                model: Address,
                attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name'],
                as: 'invoice_address',
                required : false
            },
            {
                model: Address,
                attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name'],
                as: 'delivery_address',
                required : false
            },
            {
                model: CustomerOrder,
                attributes: ['id', 'date', 'total_price', 'status'],
                required : false,
                include: 
                [
                    {
                        model: CustomerOrderInvoice,
                        attributes: ['id', 'number', 'creation_date', 'due_date', 'status'],
                        required : false,
        
                    },
                    {
                        model: CustomerOrderDelivery,
                        attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status'],
                        required : false
                    },
                    {
                        model: Product,
                        attributes: ['id', 'number', 'name', 'sale_price', 'short_details'],
                        through: {
                            attributes: ['product_order_quantity', 'product_order_comment', 'product_variant_id', 'product_size_id']
                        },
                        as: 'Products',
                        required : false
                    }
                ]
            },
            {
                model: CustomerPaymentMethod,
                attributes: ['id', 'name', 'description'],
                required : false
            }
        ]
    })
    .then((customers) => {
        res.status(200).send(customers);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getCustomerOrdersByUser = (req, res) => {
    // Get CustomerOrder(s) by user from the Database
    CustomerOrder.findAll({
        where: {user_id: req.userId},
        attributes: ['id', 'date', 'total_price', 'status'],
        include: 
        [
            {
                model: CustomerOrderInvoice,
                attributes: ['id', 'number', 'creation_date', 'due_date', 'status'],
                required : false,

            },
            {
                model: CustomerOrderDelivery,
                attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status'],
                required : false
            },
            {
                model: Product,
                attributes: ['id', 'number', 'name', 'sale_price', 'short_details'],
                through: {
                    attributes: ['product_order_quantity', 'product_order_comment', 'product_variant_id', 'product_size_id']
                },
                as: 'Products',
                required : false
            }
        ]
    })
    .then((customerOrders) => {
        res.status(200).send(customerOrders);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Customer and all related objects for pm and admin
exports.getAllCustomers = (req, res) => {
    // Get Customer(s) from the Database
    Customer.findAll({
        attributes: ['id', 'phone_number', 'email'],
        include: 
        [
            {
                model: Address,
                attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name'],
                as: 'invoice_address',
                required : false
            },
            {
                model: Address,
                attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name'],
                as: 'delivery_address',
                required : false
            },
            {
                model: CustomerOrder,
                attributes: ['id', 'date', 'total_price', 'status'],
                required : false,
                include: 
                [
                    {
                        model: CustomerOrderInvoice,
                        attributes: ['id', 'number', 'creation_date', 'due_date', 'status'],
                        required : false,
        
                    },
                    {
                        model: CustomerOrderDelivery,
                        attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status'],
                        required : false
                    },
                    {
                        model: Product,
                        attributes: ['id', 'number', 'name', 'sale_price', 'short_details'],
                        through: {
                            attributes: ['product_order_quantity', 'product_order_comment', 'product_variant_id', 'product_size_id']
                        },
                        as: 'Products',
                        required : false
                    }
                ]
            },
            {
                model: CustomerPaymentMethod,
                attributes: ['id', 'name', 'description'],
                required : false
            }
        ]
    })
    .then((customers) => {
        res.status(200).send(customers);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllCustomerPayments = (req, res) => {
    // Get CustomerPayment(s) from the Database
    CustomerPayment.findAll({
        attributes: ['id', 'date', 'amount'],
        include: 
        [
            {
                model: CustomerPaymentMethod,
                attributes: ['id', 'name', 'description'],
                required : false
            }
        ]
    })
    .then((customerPayments) => {
        res.status(200).send(customerPayments);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllCustomerPaymentMethods = (req, res) => {
    // Get CustomerPaymentMethod(s) from the Database
    CustomerPaymentMethod.findAll({
        attributes: ['id', 'name', 'description']
    })
    .then((customerPaymentMethods) => {
        res.status(200).send(customerPaymentMethods);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllCustomerOrders = (req, res) => {
    // Get CustomerOrder(s) from the Database
    CustomerOrder.findAll({
        attributes: ['id', 'date', 'total_price', 'status'],
        include: 
        [
            {
                model: CustomerOrderInvoice,
                attributes: ['id', 'number', 'creation_date', 'due_date', 'status'],
                required : false,

            },
            {
                model: CustomerOrderDelivery,
                attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status'],
                required : false
            },
            {
                model: Product,
                attributes: ['id', 'number', 'name', 'sale_price', 'short_details'],
                through: {
                    attributes: ['product_order_quantity', 'product_order_comment', 'product_variant_id', 'product_size_id']
                },
                as: 'Products',
                required : false
            }
        ]
    })
    .then((customerOrders) => {
        res.status(200).send(customerOrders);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllCustomerOrderInvoices = (req, res) => {
    // Get CustomerOrderInvoice(s) from the Database
    CustomerOrderInvoice.findAll({
        attributes: ['id', 'number', 'creation_date', 'due_date', 'status'],
        include: 
        [
            {
                model: CustomerPayment,
                attributes: ['id', 'date', 'amount'],
                required : false
            }
        ]
    })
    .then((customerOrderInvoices) => {
        res.status(200).send(customerOrderInvoices);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllCustomerOrderDeliveries = (req, res) => {
    // Get CustomerOrderDelivery(-ies) from the Database
    CustomerOrderDelivery.findAll({
        attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status']
    })
    .then((customerOrderDeliveries) => {
        res.status(200).send(customerOrderDeliveries);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}
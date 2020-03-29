var db = require('../models/db.config.js');

var sequelize = db.sequelize;
var Op = db.Sequelize.Op;
var Article = db.article;
var CustomerOrder = db.customer_order;
var Discount = db.discount;
var Product = db.product;
var ProductType = db.product_type;
var ProductCategory = db.product_category;
var ProductCollection = db.product_collection;
var ProductGroup = db.product_group;
var ProductSize = db.product_size;
var ProductPicture = db.product_picture;
var ProductVariant = db.product_variant;
var SupplierInvoice = db.supplier_invoice;
var SupplierDelivery = db.supplier_delivery;

exports.addProduct = (req, res) => {
    // Save Product to Database
    return sequelize.transaction(function (t) {
        return Product.create({
            number: req.body.number,
            name: req.body.name,
            supplier_price: req.body.price,
            sale_price: req.body.salePrice,
            short_details: req.body.shortDetails,
            description: req.body.description,
            articles: req.body.articles,
            product_variants: req.body.productVariants
        }, {
            include: [
                {model: Article},
                {model: ProductVariant, 
                    include: 
                    [
                        {model: ProductPicture}
                    ]
                }
            ], 
            transaction: t
        }).then((product) => {
            return ProductType.findOne({
                where: {
                    number: req.body.productType
                }
            }, {transaction: t})
            .then(productType => {
                return product.setProduct_type(productType, {transaction: t});
            });
        }).then((product) => {
            return ProductCategory.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productCategory + '%'
                    }
                }
            }, {transaction: t})
            .then(productCategory => {
                return product.setProduct_category(productCategory, {transaction: t});
            });
        }).then((product) => {
            return ProductCollection.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productCollection + '%'
                    }
                }
            }, {transaction: t})
            .then(productCollection => {
                return product.setProduct_collection(productCollection, {transaction: t});
            });
        }).then((product) => {
            return ProductGroup.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productGroup + '%'
                    }
                }
            }, {transaction: t})
            .then(productGroup => {
                return product.setProduct_group(productGroup, {transaction: t});
            });
        }).then((product) => {
            return ProductSize.findAll({
                where: {
                    type: {
                        [Op.or]: req.body.productSizes
                    }
                }
            }, {transaction: t})
            .then(productSizes => {
                return product.setProduct_sizes(productSizes, {transaction: t});
            });
        });
    }).then(() => {
        res.send("Product has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductType = (req, res) => {
    // Save ProductType to Database
    return sequelize.transaction(function (t) {
        return ProductType.create({
            number: req.body.number,
            name: req.body.name,
            description: req.body.description
        }, { transaction: t });
    }).then(() => {
        res.send("ProductType has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductCategory = (req, res) => {
    // Save ProductCategory to Database
    return sequelize.transaction(function (t) {
        return ProductCategory.create({
            name: req.body.name,
            description: req.body.description,
            theme: req.body.theme
        }, { transaction: t });
    }).then(() => {
        res.send("ProductCategory has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductCollection = (req, res) => {
    // Save ProductCollection to Database
    return sequelize.transaction(function (t) {
        return ProductCollection.create({
            name: req.body.name,
            description: req.body.description
        }, { transaction: t });
    }).then(() => {
        res.send("ProductCollection has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductGroup = (req, res) => {
    // Save ProductGroup to Database
    return sequelize.transaction(function (t) {
        return ProductGroup.create({
            name: req.body.name,
            description: req.body.description,
            sale_priority: req.body.salePriority
        }, { transaction: t });
    }).then(() => {
        res.send("ProductGroup has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductPicture = (req, res) => {
    // Save ProductPicture to Database
    return sequelize.transaction(function (t) {
        return ProductPicture.create({
            file: req.body.file,
            description: req.body.description,
            rating: req.body.rating
        }, { transaction: t })
        .then((productPicture) => {
            return ProductVariant.findOne({
                where: {
                    name: req.body.productVariant
                }
            }, {transaction: t})
            .then(productVariant => {
                return productPicture.setProduct_variant(productVariant, {transaction: t});
            });
        });
    }).then(() => {
        res.send("ProductPicture has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductSize = (req, res) => {
    // Save ProductSize to Database
    return sequelize.transaction(function (t) {
        return ProductSize.create({
            type: req.body.type,
            value_int: req.body.valueInt,
            value_eu: req.body.valueEu,
            value_us: req.body.valueUs,
            value_uk: req.body.valueUk,
            value_fr: req.body.valueFr,
            value_it: req.body.valueIt,
            details: req.body.details
        }, { transaction: t })
        .then((productSize) => {
            return Product.findOne({
                where: {
                    number: req.body.productNumber
                }
            }, {transaction: t})
            .then(product => {
                return productSize.setProduct(product, {transaction: t});
            });
        });
    }).then(() => {
        res.send("ProductSize has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addProductVariant = (req, res) => {
    // Save ProductVariant to Database
    return sequelize.transaction(function (t) {
        return ProductVariant.create({
            name: req.body.name,
            color: req.body.color
        }, { transaction: t })
        .then((productVariant) => {
            return Product.findOne({
                where: {
                    number: req.body.productNumber
                }
            }, {transaction: t})
            .then(product => {
                return productVariant.setProduct(product, {transaction: t});
            });
        });
    }).then(() => {
        res.send("ProductVariant has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addArticle = (req, res) => {
    // Save Article to Database
    return sequelize.transaction(function (t) {
        return Article.create({
            number: req.body.number,
            barcode: req.body.barcode,
            status: req.body.status
        }, {transaction: t})
        .then((article) => {
            return Product.findOne({
                where: {
                    number: req.body.productNumber
                }
            }, {transaction: t})
            .then(product => {
                return article.setProduct(product, {transaction: t});
            });
        })
        .then((article) => {
            return ProductVariant.findOne({
                where: {
                    id: req.body.productVariantId
                }
            }, {transaction: t})
            .then(productVariant => {
                return article.setProduct_variant(productVariant, {transaction: t});
            });
        })
        .then((article) => {
            return ProductSize.findOne({
                where: {
                    id: req.body.productSizeId
                }
            }, {transaction: t})
            .then(productSize => {
                return article.setProduct_size(productSize, {transaction: t});
            });
        })
        .then((article) => {
            return CustomerOrder.findOne({
                where: {
                    id: req.body.customerOrderId
                }
            }, {transaction: t})
            .then(customerOrder => {
                return article.setCustomer_order(customerOrder, {transaction: t});
            });
        });
    }).then(() => {
        res.send("Article has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addDiscount = (req, res) => {
    // Save Discount to Database
    return sequelize.transaction(function (t) {
        return Discount.create({
            percent: req.body.percent,
            is_active: req.body.is_active
        }, {transaction: t})
        .then((discount) => {
            return Product.findAll({
                where: {
                    number: {[Op.or]: req.body.productNumbers}
                }
            }, {transaction: t})
            .then(products => {
                return discount.setProducts(products, {transaction: t});
            });
        });
    }).then(() => {
        res.send("Discount has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProduct = (req, res) => {
    // Update Product to Database
    return sequelize.transaction(function (t) {
        return Product.update({
            number: req.body.number,
            name: req.body.name,
            supplier_price: req.body.price,
            sale_price: req.body.salePrice,
            short_details: req.body.shortDetails,
            description: req.body.description,
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        }).then((product) => {
            return ProductType.findOne({
                where: {
                    number: req.body.productType
                }
            }, {transaction: t})
            .then(productType => {
                return product.setProduct_type(productType, {transaction: t});
            });
        }).then((product) => {
            return ProductCategory.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productCategory + '%'
                    }
                }
            }, {transaction: t})
            .then(productCategory => {
                return product.setProduct_category(productCategory, {transaction: t});
            });
        }).then((product) => {
            return ProductCollection.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productCollection + '%'
                    }
                }
            }, {transaction: t})
            .then(productCollection => {
                return product.setProduct_collection(productCollection, {transaction: t});
            });
        }).then((product) => {
            return ProductGroup.findOne({
                where: {
                    name:{
                        [Op.like]: '%' + req.body.productGroup + '%'
                    }
                }
            }, {transaction: t})
            .then(productGroup => {
                return product.setProduct_group(productGroup, {transaction: t});
            });
        }).then((product) => {
            return ProductSize.findAll({
                where: {
                    type: {
                        [Op.or]: req.body.productSizes
                    }
                }
            }, {transaction: t})
            .then(productSizes => {
                return product.setProduct_sizes(productSizes, {transaction: t});
            });
        }).then(() => {
            res.send("Product has been successful updated!");
        }).catch(err => {
            res.status(500).send("Fail Error -> " + err);
        });
    });
}

exports.updateProductType = (req, res) => {
    // Update ProductType to Database
    return sequelize.transaction(function (t) {
        return ProductType.update({
            number: req.body.number,
            name: req.body.name,
            description: req.body.description
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("ProductType has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductCategory = (req, res) => {
    // Update ProductCategory to Database
    return sequelize.transaction(function (t) {
        return ProductCategory.update({
            name: req.body.name,
            description: req.body.description,
            theme: req.body.theme
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("ProductCategory has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductCollection = (req, res) => {
    // Update ProductCollection to Database
    return sequelize.transaction(function (t) {
        return ProductCollection.update({
            name: req.body.name,
            description: req.body.description
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("ProductCollection has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductGroup = (req, res) => {
    // Update ProductGroup to Database
    return sequelize.transaction(function (t) {
        return ProductGroup.update({
            name: req.body.name,
            description: req.body.description,
            sale_priority: req.body.salePriority
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("ProductGroup has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductPicture = (req, res) => {
    // Update ProductPicture to Database
    return sequelize.transaction(function (t) {
        return ProductPicture.update({
            file: req.body.file,
            description: req.body.description,
            rating: req.body.rating
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        }).then((productPicture) => {
            return ProductVariant.findOne({
                where: {
                    name: req.body.productVariant
                }
            }, {transaction: t})
            .then(productVariant => {
                return productPicture.setProduct_variant(productVariant, {transaction: t});
            });
        });
    }).then(() => {
        res.send("ProductPicture has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductSize = (req, res) => {
    // Update ProductSize to Database
    return sequelize.transaction(function (t) {
        return ProductSize.update({
            type: req.body.type,
            value_int: req.body.valueInt,
            value_eu: req.body.valueEu,
            value_us: req.body.valueUs,
            value_uk: req.body.valueUk,
            value_fr: req.body.valueFr,
            value_it: req.body.valueIt,
            details: req.body.details
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("ProductSize has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateProductVariant = (req, res) => {
    // Update ProductVariant to Database
    return sequelize.transaction(function (t) {
        return ProductVariant.update({
            name: req.body.name,
            color: req.body.color
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        }).then((productVariant) => {
            return Product.findOne({
                where: {
                    number: req.body.productNumber
                }
            }, {transaction: t})
            .then(product => {
                return productVariant.setProduct(product, {transaction: t});
            });
        });
    }).then(() => {
        res.send("ProductVariant has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateArticle = (req, res) => {
    // Update Article to Database
    return sequelize.transaction(function (t) {
        return Article.update({
            number: req.body.number,
            barcode: req.body.barcode,
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        })
        .then((article) => {
            return Product.findOne({
                where: {
                    number: req.body.productNumber
                }
            }, {transaction: t})
            .then(product => {
                return article.setProduct(product, {transaction: t});
            });
        })
        .then((article) => {
            return ProductVariant.findOne({
                where: {
                    id: req.body.productVariantId
                }
            }, {transaction: t})
            .then(productVariant => {
                return article.setProduct_variant(productVariant, {transaction: t});
            });
        })
        .then((article) => {
            return ProductSize.findOne({
                where: {
                    id: req.body.productSizeId
                }
            }, {transaction: t})
            .then(productSize => {
                return article.setProduct_size(productSize, {transaction: t});
            });
        })
        .then((article) => {
            return CustomerOrder.findOne({
                where: {
                    id: req.body.customerOrderId
                }
            }, {transaction: t})
            .then(customerOrder => {
                return article.setCustomer_order(customerOrder, {transaction: t});
            });
        });
    }).then(() => {
        res.send("Article has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateDiscount = (req, res) => {
    // Update Discount to Database
    return sequelize.transaction(function (t) {
        return Discount.update({
            percent: req.body.percent,
            is_active: req.body.is_active
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("Discount has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProducts = (req, res) => {
    // Get Product(s) from the Database
    db.sequelize
    .query('CALL GetAllProductsWithBindData();', { 
        replacements: {},
        type: db.sequelize.QueryTypes.SELECT
    })
    .then(function(response) {
        var products =[];
        for(var index in response[0]){
            try {
                products.push(JSON.parse(response[0][index].product));
            } catch(err) {
                //console.log(err);
                res.status(500).send("Fail! Error -> An error appear while parsing the result to json");
            }
        }
        res.status(200).send(products);
    })
    .catch(err => {
        res.status(500).send("Fail! Error -> " + err);
    });
}

exports.getAllProductCategories = (req, res) => {
    // Get ProductCategory(ies) from the Database
    ProductCategory.findAll({})
    .then((productCategories) => {
        res.status(200).send(productCategories);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductCollections = (req, res) => {
    // Get ProductCollection(s) from the Database
    ProductCollection.findAll({})
    .then((productCollections) => {
        res.status(200).send(productCollections);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductGroups = (req, res) => {
    // Get ProductGroup(s) from the Database
    ProductGroup.findAll({})
    .then((productGroups) => {
        res.status(200).send(productGroups);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductTypes = (req, res) => {
    // Get ProductType(s) from the Database
    ProductType.findAll({})
    .then((productTypes) => {
        res.status(200).send(productTypes);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductSizes = (req, res) => {
    // Get ProductSize(s) from the Database
    ProductSize.findAll({})
    .then((productSizes) => {
        res.status(200).send(productSizes);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductPictures = (req, res) => {
    // Get ProductPicture(s) from the Database
    ProductPicture.findAll({})
    .then((productPictures) => {
        res.status(200).send(productPictures);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllProductVariants = (req, res) => {
    // Get ProductSize(s) from the Database
    ProductVariant.findAll({})
    .then((productVariants) => {
        res.status(200).send(productVariants);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllArticles = (req, res) => {
    // Get Article(s) from the Database
    Article.findAll({
        attributes: ['number', 'barcode', 'status', 'product_id', 'product_variant_id', 'product_size_id', 'customer_order_id'],
        include: 
        [
            {
                model: SupplierInvoice,
                attributes: ['number', 'price', 'paid_price', 'date', 'due_date', 'status'],
                required : false
            },
            {
                model: SupplierDelivery,
                attributes: ['number', 'date', 'noa', 'price', 'weight'],
                required : false
            }
        ]
    })
    .then((articles) => {
        res.status(200).send(articles);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getArticlesByProduct = (req, res) => {
    // Get Article(s) by product from the Database
    Article.findAll({
        where: {product_id: req.params.id},
        attributes: ['number', 'barcode', 'status', 'product_id', 'product_variant_id', 'product_size_id', 'customer_order_id'],
        include: 
        [
            {
                model: SupplierInvoice,
                attributes: ['number', 'price', 'paid_price', 'date', 'due_date', 'status'],
                required : false
            },
            {
                model: SupplierDelivery,
                attributes: ['number', 'date', 'noa', 'price', 'weight'],
                required : false
            }
        ]
    })
    .then((articles) => {
        res.status(200).send(articles);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllDiscounts = (req, res) => {
    // Get Discount(s) from the Database
    Discount.findAll({
        attributes: ['percent', 'is_active'],
    })
    .then((discounts) => {
        res.status(200).send(discounts);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}
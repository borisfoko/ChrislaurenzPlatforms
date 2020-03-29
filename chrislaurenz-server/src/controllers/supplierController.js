var db = require('../models/db.config.js');

var sequelize = db.sequelize;

var Supplier = db.supplier;
var SupplierDelivery = db.supplier_delivery;
var SupplierInvoice = db.supplier_invoice;
var Address = db.address;

exports.addSupplier = (req, res) => {
    // Save Supplier to Database
    return sequelize.transaction(function (t) {
        return Supplier.create({
            number: req.body.number,
            name: req.body.name,
            contract_start_date: req.body.contractStartDate,
            email: req.body.email,
            phone_number: req.body.phoneNumber,
            tel_number: req.body.telNumber,
            supplier_address: req.body.address
        }, {
            include: [
                {model: Address}
            ],
            transaction: t});
    }).then(() => {
        res.send("Supplier has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addSupplierInvoice = (req, res) => {
    // Save SupplierInvoice to Database
    return sequelize.transaction(function (t) {
        return SupplierInvoice.create({
            number: req.body.number,
            price: req.body.price,
            paid_price: req.body.paid_price,
            date: req.body.date,
            due_date: req.body.due_date,
            status: req.body.status
        }, {transaction: t}).then((supplierInvoice) => {
            return Supplier.findOne({
                where: {
                    number: req.body.supplierNumber
                }
            }, {transaction: t})
            .then(supplier => {
                return supplierInvoice.setSupplier(supplier, {transaction: t});
            });
        });
    }).then(() => {
        res.send("SupplierInvoice has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.addSupplierDelivery = (req, res) => {
    // Save SupplierDelivery to Database
    return sequelize.transaction(function (t) {
        return SupplierDelivery.create({
            number: req.body.number,
            date: req.body.date,
            noa: req.body.noa,
            price: req.body.price,
            weight: req.body.weight
        }, {transaction: t}).then((supplierDelivery) => {
            return Supplier.findOne({
                where: {
                    number: req.body.supplierNumber
                }
            }, {transaction: t})
            .then(supplier => {
                return supplierDelivery.setSupplier(supplier, {transaction: t});
            });
        });
    }).then(() => {
        res.send("SupplierDelivery has been successful added!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateSupplier = (req, res) => {
    // Update Supplier to Database
    return sequelize.transaction(function (t) {
        return Supplier.update({
            number: req.body.number,
            name: req.body.name,
            contract_start_date: req.body.contractStartDate,
            email: req.body.email,
            phone_number: req.body.phoneNumber,
            tel_number: req.body.telNumber
        }, {
            where: {
                id: req.params.id
            },
            transaction: t
        });
    }).then(() => {
        res.send("Supplier has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateSupplierInvoice = (req, res) => {
    // Update SupplierInvoice to Database
    return sequelize.transaction(function (t) {
        return SupplierInvoice.update({
            number: req.body.number,
            price: req.body.price,
            paid_price: req.body.paid_price,
            date: req.body.date,
            due_date: req.body.due_date,
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            },
            transaction: t});
    }).then(() => {
        res.send("SupplierInvoice has been successful updated!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.updateSupplierDelivery = (req, res) => {
    // Update SupplierDelivery to Database
    return sequelize.transaction(function (t) {
        return SupplierDelivery.update({
            number: req.body.number,
            date: req.body.date,
            noa: req.body.noa,
            price: req.body.price,
            weight: req.body.weight
        }, {
            where: {
                id: req.params.id
            },
            transaction: t});
    }).then(() => {
        res.send("SupplierDelivery has been successful update!");
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllSuppliers = (req, res) => {
    // Get Supplier(s) from the Database
    Supplier.findAll({
        attributes: ['id', 'number', 'name', 'contract_start_date', 'email', 'phone_number' ,'tel_number'],
        include: 
        [
            {
                model: Address,
                attributes: ['country', 'state', 'city', 'post_code', 'street_name'],
                as: 'supplier_address'
            },
            {
                model: SupplierInvoice,
                attributes: ['number', 'price', 'paid_price', 'date', 'due_date', 'status']
            },
            {
                model: SupplierDelivery,
                attributes: ['number', 'date', 'noa', 'price', 'weight']
            }
        ]
    })
    .then((blogs) => {
        res.status(200).send(blogs);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}
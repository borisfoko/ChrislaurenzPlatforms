const db = require('../models/db.config.js');

var sequelize = db.sequelize;

var Address = db.address;
var Customer = db.customer;

// Get one address by Id
exports.getAddressById = (req, res) => {
    // Get Address from the Database
    Address.findAll({
        where: {id: req.params.id},
        attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name']
    }).then((address) => {
        res.status(200).send(address);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Get all address
exports.getAllAddress = (req, res) => {
    // Get Address(s) from the Database
    Address.findAll({
        attributes: ['id', 'country', 'state', 'city', 'post_code', 'street_name']
    })
    .then((address) => {
        res.status(200).send(address);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Add address and all related objects
exports.addAddress = (req, res) => {
    // Save address to Database
    return sequelize.transaction(function (t) {
        return Address.create({
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            post_code: req.body.post_code,
            street_name: req.body.street_name
        }, {transaction: t})
        .then(address => {
            return Customer.findOne({
                where: {
                    id: req.params.id
                }
            }, {transaction: t})
            .then(customer => {
                if(!customer) {
                    throw "No customer found.";
                }
                if (req.body.type === 'address-billing') {
                    return customer.update({
                        invoice_address_id: address.id
                    }, {transaction: t});
                } else if (req.body.type === 'address-shipping') {
                    return customer.update({
                        delivery_address_id: address.id
                    }, {transaction: t});
                } else {
                    throw 'Unknow address type.'
                }
            });
        });
    }).then(() => {
        res.send({message: "Address has been successful added!"});
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Update address and all related objects
exports.updateAddress = (req, res) => {
    // Update address to Database
    return sequelize.transaction(function (t) {
        return Address.update({
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            post_code: req.body.post_code,
            street_name: req.body.street_name
        }, {
            where: {
            id: req.params.id
        }, transaction: t});
    }).then(() => {
        res.send({message: "Address has been successful updated!"});
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

// Delete address and all related objects
exports.deleteAddress = (req, res) => {
    // Delete address to Database
    return sequelize.transaction(function (t) {
        return Address.destroy({
            where: { id: req.params.id }
        }, {transaction: t});
    }).then(() => {
        res.send({message: "Address has been successful deleted!"});
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}
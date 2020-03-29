var db = require('../models/db.config.js');
var crypto = require('crypto-random-string');

var sequelize = db.sequelize;

var Newsletter = db.newsletter;

exports.addNewsletterOrEnable = (req, res) => {
    // Save Newsletter to Database
    return sequelize.transaction(function (t) {
        return Newsletter.findOne({
            where: {email: req.body.email}
        }, {transaction: t})
        .then((newsletter) => {
            if(!newsletter) {
                return Newsletter.create({
                    email: req.body.email,
                    token: crypto({length: 40, type:'url-safe'}),
                    gender: req.body.gender,
                    creation_timestamp: req.body.creationTimestamp
                }, {transaction: t});
            }
            return newsletter.update({is_active: 1, token: crypto({length: 40, type:'url-safe'})}, {transaction: t});
        });
        
    }).then(() => {
        res.status(200).send({message: "Newsletter has been successful updated or added!"});
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.disableNewsletter = (req, res) => {
    // Disable Newsletter in the Database
    return sequelize.transaction(function (t) {
        return Newsletter.findOne({
            where: {token: req.body.token, email: req.body.email}
        }, {transaction: t})
        .then((newsletter) => {
            if(!newsletter) {
                throw "wrong token parameter.";
            }
            return newsletter.update({is_active: 0}, {transaction: t});
        });
    }).then(() => {
        res.status(200).send({message: "Newsletter has been successful disabled!"});
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getAllNewsletters = (req, res) => {
    // Get Newsletter(s) from the Database
    Newsletter.findAll({
        attributes: ['id', 'email', 'token', 'gender', 'creation_timestamp', 'is_active']
    })
    .then((newsletters) => {
        res.status(200).send(newsletters);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}

exports.getNewsletterById = (req, res) => {
    // Get Newsletter by Id from the Database
    Newsletter.findAll({
        where: {id: req.params.id},
        attributes: ['id', 'email', 'token', 'gender', 'creation_timestamp', 'is_active']
    }).then((newsletter) => {
        res.status(200).send(newsletter);
    }).catch(err => {
        res.status(500).send("Fail Error -> " + err);
    });
}
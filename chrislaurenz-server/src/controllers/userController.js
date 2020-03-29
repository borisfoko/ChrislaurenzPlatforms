var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var crypto = require('crypto-random-string');

var emailHandler  = require('../emails/emailHandler.js');
var db = require('../models/db.config.js');
var config = require('../config/config.js');

const tokenList = {};
var User = db.user;
var Role = db.role;
var Product = db.product;
var Customer = db.customer;
var Newsletter = db.newsletter;
var CustomerOrder = db.customer_order;
var CustomerOrderDelivery = db.customer_order_delivery;
var CustomerOrderInvoice = db.customer_order_invoice;
var CustomerPaymentMethod = db.customer_payment_method;
var Verification = db.verification;
var Address = db.address;

var sequelize = db.sequelize;
var Op = db.Sequelize.Op;

exports.getAllUsers = (req, res) => {
  // Get User(s) from the Database
  User.findAll({
      attributes: ['id', 'email', 'first_name', 'middle_name', 'last_name', 'gender', 'birthday', 'creation_timestamp', 'is_activ'],
      include: 
      [
          {
              model: Customer,
              attributes: ['phone_number', 'email'],
              require: false
          },
          {
            model: Role,
            attributes: ['name'],
            through: {
              attributes: ['user_id', 'role_id'],
            },
            require: false
          }
      ]
  })
  .then((users) => {
      res.status(200).send(users);
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.getAllRoles = (req, res) => {
  // Get Role(s) from the Database
  Role.findAll({
      attributes: ['id', 'name']
  })
  .then((roles) => {
      res.status(200).send(roles);
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.addUser = (req, res) => {
  // Save User to Database
  return sequelize.transaction(function (t) {
    return User.create({
      email: req.body.email,
      first_name: req.body.firstname,
      middle_name: req.body.middlename,
      last_name: req.body.lastname,
      gender: req.body.gender,
      birthday: req.body.birthday,
      password: bcrypt.hashSync(req.body.password, 8),
      is_activ: req.body.isActiv 
    }, {transaction: t})
    .then(user => {
      return Role.findAll({
        where: {name: {[Op.or]: req.body.roles}}
      }, {transaction: t})
      .then(roles => {
        return user.setRoles(roles, {transaction: t});
      });
    });
  }).then(() => {
      res.send({message: "User has been successfull added!"});
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.updatePassword = (req, res) => {
  return sequelize.transaction(function (t) {
    return User.findOne({ where: { id: req.params.id, is_activ: '1' }, transaction: t })
    .then((user) => {
      if (!user) {
        throw 'No active user Not Found.';
      }
      var passwordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
      if (!passwordIsValid) {
        throw 'Invalid Password!';
      }
      return user.update({ password: bcrypt.hashSync(req.body.newPassword, 8) }, { transaction: t});
    });
  })
  .then(() => {
    res.send({message: "Password updated successfully!"});
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.updateUser = (req, res) => {
  // Update User to Database
  return sequelize.transaction(function (t) {
    return User.update({
      email: req.body.email,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      gender: req.body.gender,
      is_activ: req.body.is_activ
    }, {
      where: { id: req.params.id }, 
      transaction: t}).then(() => {
        return Customer.update({
          phone_number: req.body.customers[0].phone_number,
          email: req.body.customers[0].email
        }, { where: { user_id: req.params.id }, 
        transaction: t});
    });
  }).then(() => {
      res.send({message: "User updated successfully!"});
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.signUp = (req, res) => {
  // Save User to Database
  //console.log("Processing func -> SignUp");
  return sequelize.transaction(function (t) {
    //console.log(req.body);
    return User.create({
      email: req.body.email,
      first_name: req.body.firstname,
      middle_name: req.body.middlename,
      last_name: req.body.lastname,
      gender: req.body.gender,
      birthday: req.body.birthday,
      password: bcrypt.hashSync(req.body.password, 8),
      customers: [req.body.customer]
    }, {
      include: [Customer],
      transaction: t})
    .then(user => {
      return Role.findAll({
        where: {name: {[Op.or]: ['USER']}}
      }, {transaction: t})
      .then(roles => {
        return user.setRoles(roles, {transaction: t});
      })
      .then(() => {
        return Verification.create({
          token: crypto({length: 40, type:'url-safe'}),
          description: 'A',
          user_id: user.id
        }, {transaction: t})
        .then((verification) => {
          var confirmationEmailText = 'To get started, click the link below to confirm your account or copy the provided url to your browser.', 
          confirmationEmailButton = 'Confirm your account',
          confirmationEmailThanks = 'Thanks for joining Us!',
          confirmationEmailTitle = 'Confirmation instructions',
          confirmationLinkUrlText = 'Link Url';
          emailFollowUsText = 'Follow us',
          whishlist = 'Wishlist',
          contact ='Contact';
          switch (req.body.lang) {
            case 'de':
              confirmationEmailText = 'klicken Sie auf den Link unten, um Ihr Konto zu bestätigen oder öffnen Sie die angegebene URL in Ihren Browser.';
              confirmationEmailThanks = 'Danke, dass Sie sich bei uns registriert haben!',
              confirmationEmailButton = 'Bestätigen Sie Ihr Konto';
              confirmationEmailTitle = 'E-Mail Bestätigung';
              confirmationLinkUrlText = 'Url Link';
              emailFollowUsText = 'Folgen Sie uns';
              whishlist = 'Wunschzettel';
              contact = 'Kontakt';
              break;
            case 'fr':
              confirmationEmailText = 'Veuillez cliquez sur le lien suivant';
              confirmationEmailThanks = 'Merci de vous inscrire chez nous !';
              confirmationEmailButton = 'Confirmez votre compte';
              confirmationEmailTitle = 'Verification d\'identidé';
              confirmationLinkUrlText = 'Lien url';
              emailFollowUsText = 'Suivez nous';
              whishlist = 'Liste de souhaits';
              contact = 'Contact'
              break;
            default:
              break;
          }
          return emailHandler.sendVerificationMail(
            user.email,
            {
              whishlist: whishlist,
              contact: contact,
              descriptionText: confirmationEmailText,
              thanks: confirmationEmailThanks,
              linkText: confirmationEmailButton,
              subject: confirmationEmailTitle,
              followUs: emailFollowUsText,
              urlDesc: confirmationLinkUrlText,
              url: `https://chrislaurenz.de/#/verification?token=${verification.token}&email=${user.email}`
            });
        });
      })
      .then(() => {
        return Newsletter.findOne({
            where: {email: req.body.email}
        }, {transaction: t})
        .then((newsletter) => {
            if(!newsletter) {
                return Newsletter.create({
                    email: req.body.email,
                    token: crypto({length: 40, type:'url-safe'}),
                    gender: req.body.gender
                }, {transaction: t});
            }
            return newsletter.update({is_active: 1, token: crypto({length: 40, type:'url-safe'})}, {transaction: t});
        });
      });
    });
  }).then(() => {
      res.status(200).send({message: "User registered successfully!"});
  }).catch(err => {
      res.status(500).send("Fail Error -> " + err);
  });
}

exports.verifyIdentity = (req, res) => {
  return sequelize.transaction(function (t) {
    return Verification.findOne({
      where: {token: req.body.token, description: 'A'}
    }, {transaction: t})
    .then((verification) => {
      if(!verification) {
        throw "wrong token parameter.";
      }
      return User.findOne({
        where: {id: verification.user_id, is_activ: '0', email: req.body.email}
      }, {transaction: t})
      .then((user) => {
        if(!user) {
          throw "No user found.";
        }
        return user.update({is_activ: '1'}, {transaction: t})
        .then(() => { return Verification.destroy({  where: {id: verification.id} }, {transaction: t})
        })
      });
    });
  }).then(() => {
      res.status(200).send({message: "User Identity succsessfull vefified!"});
  }).catch(err => {
      res.status(500).send("" + err);
  });
}

exports.verifyResetIdentity = (req, res) => {
  return sequelize.transaction(function (t) {
    return Verification.findOne({
      where: {token: req.body.token, description: 'R'}
    }, {transaction: t})
    .then((verification) => {
      if(!verification) {
        throw "wrong token.";
      }
      return User.findOne({
        where: {id: verification.user_id, is_activ: '1', email: req.body.email}
      }, {transaction: t})
      .then((user) => {
        if(!user) {
          throw "No matching user found.";
        }
        return;
      });
    });
  }).then(() => {
      res.status(200).send({message: "User Identity succsessfull vefified!"});
  }).catch(err => {
      res.status(500).send("" + err);
  });
}

exports.resetPassword = (req, res) => {
  return sequelize.transaction(function (t) {
    return Verification.findOne({
      where: {token: req.body.token, description: 'R'}
    }, {transaction: t})
    .then((verification) => {
      if(!verification) {
        throw "wrong token parameter.";
      }
      return User.findOne({
        where: {id: verification.user_id, is_activ: '1', email: req.body.email}
      }, {transaction: t})
      .then((user) => {
        if(!user) {
          throw "No user found.";
        }
        return user.update({password: bcrypt.hashSync(req.body.newPassword, 8)}, {transaction: t})
        .then(() => { return Verification.destroy({  where: {id: verification.id} }, {transaction: t})
        })
      });
    });
  }).then(() => {
      res.status(200).send({message: "User password was succesful reseted!"});
  }).catch(err => {
      res.status(500).send("" + err);
  });
}

exports.sendResetPasswordEmail = (req, res) => {
  return sequelize.transaction(function (t) {
    return User.findOne({
      where: {email: req.body.email, is_activ: '1'}
    })
    .then((user) => {
      if(!user) {
        throw "No user found.";
      }
      return Verification.create({
        token: crypto({length: 40, type:'url-safe'}),
        description: 'R',
        user_id: user.id
      }, {transaction: t})
      .then((verification) => {
        var confirmationEmailText = 'click the link below to reset your password or copy the provided url to your browser.', 
          confirmationEmailButton = 'Reset your password',
          confirmationEmailThanks = 'Thanks for trusting Us!',
          confirmationEmailTitle = 'Password Reset',
          confirmationLinkUrlText = 'Link Url';
          emailFollowUsText = 'Follow us',
          whishlist = 'Wishlist',
          contact ='Contact';
        switch (req.body.lang) {
          case 'de':
            confirmationEmailText = 'Klicken Sie auf den untenstehenden Link, um Ihr Passwort zurückzusetzen oder kopieren Sie die angegebene URL in Ihren Browser.', 
            confirmationEmailButton = 'Setzen Sie Ihr Passwort zurück',
            confirmationEmailThanks = 'Danke, dass Sie uns weiterhin vertrauen',
            confirmationEmailTitle = 'Passwort Zurücksetzung',
            confirmationLinkUrlText = 'Url Link';
            emailFollowUsText = 'Folgen Sie uns',
            whishlist = 'Wunschzettel',
            contact ='Kontakt';
            break;
          case 'fr':
            confirmationEmailText = 'cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe ou copiez l\'url fournie dans votre navigateur.', 
            confirmationEmailButton = 'Réinitialiser votre mot de passe',
            confirmationEmailThanks = 'Merci de continuer à nous faire confiance',
            confirmationEmailTitle = 'Réinitialisation du mot de passe',
            confirmationLinkUrlText = 'Lien url';
            emailFollowUsText = 'Suivez nous',
            whishlist = 'Liste de souhaits',
            contact ='Contact';
            break;
          default:
            break;
        }
        return emailHandler.sendVerificationMail(
          user.email,
          {
            whishlist: whishlist,
              contact: contact,
              descriptionText: confirmationEmailText,
              thanks: confirmationEmailThanks,
              linkText: confirmationEmailButton,
              subject: confirmationEmailTitle,
              followUs: emailFollowUsText,
              urlDesc: confirmationLinkUrlText,
            url: `https://chrislaurenz.de/#/reset?token=${verification.token}&email=${user.email}`
          });
      });
    });
  }).then(() => {
      res.status(200).send({message: "The reset mail have been sent to your mailbox!"});
  }).catch(err => {
      res.status(500).send("" + err);
  });
}

exports.signIn = (req, res) => {
  //console.log("Sign-In");
  
  User.findOne({
    where: {
      email: req.body.email,
      is_activ: '1'
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send('No active user Not Found.');
    }
  
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
    }
    
    var token = jwt.sign({id: user.id}, config.secret, { expiresIn: config.tokenLife });
    var refreshToken = jwt.sign({id: user.id}, config.refreshSecret);

    var authorities = [];
    tokenList[refreshToken] = {'token': token, 'refreshToken': refreshToken };
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push('ROLE_' + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        auth: true,
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: config.tokenLife,
        email: user.email,
        firstname: user.first_name,
        gender: user.gender,
        authorities: authorities
      });
    });

  }).catch(err => {
    res.status(500).send('' + err);
  });
}

exports.refreshJwtToken = (req, res) => {
  let token = req.headers['x-access-token'];
  let refreshToken = req.body.refreshToken;
  //console.log("refreshJwtToken");
  if(!token || !refreshToken) {
    return res.status(400).send({ 
      auth: false, message: 'No token provided.' 
    });
  }

  jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
    if (err) {
      return res.status(412).send({ 
        auth: false, 
        message: 'invalid_refresh_token'
      });
    }

    let newToken = jwt.sign({id: decoded.id}, config.secret, { expiresIn: config.tokenLife });
    tokenList[refreshToken].token = newToken;
    res.status(200).send({
      auth: true,
      accessToken: newToken,
      expiresIn: config.tokenLife
    });
  });
}

exports.userContent = (req, res) => {
  User.findOne({
    where: {id: req.userId},
    attributes: ['id', 'email', 'first_name', 'middle_name', 'last_name', 'gender', 'birthday', 'is_activ', 'creation_timestamp'],
    include: [
    {
      model: Customer,
      attributes: ['id', 'phone_number', 'email'],
      include: [
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
                  required : false
              },
              {
                  model: CustomerOrderDelivery,
                  attributes: ['id', 'number', 'creation_date', 'due_date', 'delivery_date', 'status'],
                  required : false
              },
              {
                  model: Product,
                  attributes: ['id', 'number', 'name', 'sale_price', 'short_details', 'product_picture_miniature'],
                  through: {
                      attributes: ['product_order_quantity', 'product_order_comment']
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
      ],
      require: false
    }]
  }).then(user => {
    res.status(200).json(user);
  }).catch(err => {
    res.status(500).json('' + err);
  });
}
  
exports.adminBoard = (req, res) => {
  User.findOne({
      where: {id: req.userId},
      attributes: ['id', 'email', 'first_name', 'middle_name', 'last_name', 'gender', 'birthday', 'creation_timestamp', 'is_activ'],
      include: [{
          model: Role,
          attributes: ['id', 'name'],
          through: {
              attributes: ['user_id', 'role_id'],
          }
      }]
  }).then(user => {
    res.status(200).json(user);
  }).catch(err => {
    res.status(500).json('' + err);
  });
}
  
exports.managementBoard = (req, res) => {
  User.findOne({
      where: {id: req.userId},
      attributes: ['id', 'email', 'first_name', 'middle_name', 'last_name', 'gender', 'birthday', 'creation_timestamp', 'is_activ'],
      include: [{
          model: Role,
          attributes: ['id', 'name'],
          through: {
            attributes: ['user_id', 'role_id'],
          }
      }]
  }).then(user => {
    res.status(200).json(user);
  }).catch(err => {
    res.status(500).json('' + err);
  });
}
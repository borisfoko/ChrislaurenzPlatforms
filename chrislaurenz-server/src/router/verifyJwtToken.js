const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const db = require('../models/db.config.js');
const Role = db.role;
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    // console.log("Vefify 1: " + token);
    if (!token){
      return res.status(400).send({ 
        auth: false, message: 'No token provided.' 
      });
    }
    
    jwt.verify(token, config.secret, (err, decoded) => {
        // console.log("Vefify 3");
      if (err){
        // console.log("Vefify 4");
        return res.status(411).send({ 
            auth: false, 
            message: 'Fail to Authentication. Error -> ' + err 
        });
      }
      req.userId = decoded.id;
      next();
    });
}

isAdmin = (req, res, next) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        user.getRoles().then(roles => {
            for(let i=0; i<roles.length; i++){
            // console.log(roles[i].name);
                if(roles[i].name.toUpperCase() === "ADMIN"){
                    next();
                    return;
                }
            }
            
            res.status(403).send("Require Admin Role!");
            return;
        })
    })  
}
   
isPmOrAdmin = (req, res, next) => {
    User.findOne({
        where: {
            id: req.userId
        }
    }).then(user => {
        user.getRoles().then(roles => {
            for(let i=0; i<roles.length; i++){          
                if(roles[i].name.toUpperCase() === "PM"){
                    next();
                    return;
                }
                if(roles[i].name.toUpperCase() === "ADMIN"){
                    next();
                    return;
                }
            }
            
            res.status(403).send("Require PM or Admin Roles!");
        })
    })
}

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isPmOrAdmin = isPmOrAdmin;
 
module.exports = authJwt;
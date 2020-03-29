const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router/router');
const compression = require('compression');
const helmet = require('helmet');
const http = require('http');
const https = require('https');

const options = {
  cert: fs.readFileSync(__dirname + '/sslcert/Lets_Encrypt_chrislaurenz.de.crt', 'utf8'),
  key: fs.readFileSync(__dirname + '/sslcert/Lets_Encrypt_chrislaurenz.de.key', 'utf8'),
  ca: fs.readFileSync(__dirname + '/sslcert/Lets_Encrypt_chrislaurenz.de-ca.crt', 'utf8')
};

const app = express()
  .use(compression())
  .use(express.static(path.join(__dirname, 'public')))
  .use(helmet())
  .use(cors())
  .use(bodyParser.json())
  .use('/api', router);

http.createServer(app).listen(process.env.PORT || 8000);
https.createServer(options, app).listen(process.env.PORT || 8443);
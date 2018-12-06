/*jslint node: true */
'use strict';
var config;
if (process.env.config) {
  config = JSON.parse(process.env.config);
} else {
  var configJson = require('./config/config.json');
  config = process.env.NODE_ENV === 'test' ? configJson.test : configJson.local;
}

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');
var enforceSsl = require('express-sslify');
var request = require('request');
var xmlToJson = require('xml2js').parseString;
var sts = require('strict-transport-security');

var app = express();

app.enable('trust proxy');
if (config.projectInfo.env !== 'local' && config.projectInfo.env !== 'test') {
  app.use(sts.getSTS({ 'max-age': { days: 90 } }));
  app.use(enforceSsl.HTTPS());
  app.use(cors({ credentials: true, origin: true }));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
// app.use('/assets', express.static(__dirname + 'client/public/assets/', { redirect: false }));
app.use(
  '/',
  express.static(path.join(__dirname, 'client/public/'), { redirect: false })
);

app.use(function(req, res, next) {
  var origin = req.headers.origin;
  if (origin && origin.includes('.homedepot.com')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
  }
  next();
});

/* Express Services */
var security = require('./server/security.js');
security(app, config);

app.get('/config', function(req, res) {
  res.json(config);
});

app.get('/getParts', function(req, res) {
  const noOfRows = req.query.noOfRows;
  const partNbr = req.query.partNbr;
  let requestUrl = config.partsServiceUrl + '/parts?partNbr=' + partNbr;
  if (noOfRows) {
    requestUrl += '&noOfRows=' + noOfRows;
  }

  var options = {
    url: requestUrl
  };

  request.get(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.post('/partsOrders', function(req, res) {
  var options = {
    url: config.partsOrdersUrl + '/partsorder',
    header: {
      Accept: 'application/json'
    },
    method: 'POST',
    json: req.body
  };

  request(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = JSON.stringify(response.body);
    }
    res.end(jsonBody);
  });
});

app.get('/partsOrders', function(req, res) {
  var options = {
    url:
      config.partsOrdersUrl + '/partsorder?locationNbr=' + req.query.locationNbr
  };

  request.get(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.get('/partsInventory', function(req, res) {
  var options = {
    url: config.partsInventoryUrl + '/partsinventory?storeNbr=' + req.query.storeNbr
  };

  request.get(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.put('/partsInventory', function(req, res) {
  var options = {
    url: config.partsInventoryUrl + '/partsinventory?userId=' + req.query.userId,
    header: {
      Accept: 'application/json'
    },
    method: 'PUT',
    json: req.body
  };

  request.put(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.post('/partsInventory', function(req, res){
  var options = {
    url : config.partsInventoryUrl + '/partsinventory?userId=' + req.query.userId,
    header: {
      Accept: 'application/json'
    },
    method: 'POST',
    json: req.body
  };

  request.post(options, function(error, response, body){
    var jsonBody;
    res.statusCode = response.statusCode;
    if(response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.get('/getPurchaseOrders', function(req, res){
  var options = {
    url: config.partsOrdersUrl + '/partsorder/purchaseorders?locationNbr=' + req.query.locationNbr
  };
  request.get(options, function(error, response, body) {
    var jsonBody;
    res.statusCode = response.statusCode;
    if (response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.post('/updateReceivePartOrder', function(req, res){
  var options = {
    url : config.partsOrdersUrl + '/partsorder/updatereceivedpartorder',
    header: {
      Accept: 'application/json'
    },
    method: 'POST',
    json: req.body
  };
  request.post(options, function(error, response, body){
    var jsonBody;
    res.statusCode = response.statusCode;
    if(response.statusCode === 200) {
      jsonBody = response.body;
    }
    res.end(jsonBody);
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// app.all('*', function (req, res) {
//   res.redirect('/');
// });

var port = process.env.PORT || 3000;

var webServer = app.listen(port, function() {
  console.log('Listening on port %d', webServer.address().port);
});

/*jslint node: true */
"use strict";

var express = require('express');
var request = require('request');
var xmlToJson = require('xml2js').parseString;
var router = express.Router();

var profile = require('./../config/profile.json');
var login = require('./../config/login.json');

module.exports = function (server) {

    router.post('/ssoLogin', function (req, res) {

        var loginInfo = JSON.parse(JSON.stringify(login));
        var profileInfo = JSON.parse(JSON.stringify(profile));
        var data = profileInfo.credentials;

        data.j_password = new Buffer(data.j_password, 'base64').toString('utf8');

        var jsonBody, jsonRaw;
        xmlToJson(loginInfo.body, { explicitArray: false, ignoreAttrs: true }, function (err, jsonResult) {
            jsonRaw = jsonResult;
            jsonBody = JSON.stringify(jsonResult);
        });

        res.statusCode = loginInfo.response.header.statusCode;
        res.statusMessage = loginInfo.response.header.statusMessagee;

        if (loginInfo.response.header.statusCode === 200) {
            res.setHeader('Set-Cookie', loginInfo.response.header.setCookie);
        } else {
            jsonBody = JSON.stringify(jsonRaw.THDLogin.Error);
        }
        res.end(jsonBody);
    });

    router.get('/getUserProfile', function (req, res) {
        var profileInfo = JSON.parse(JSON.stringify(profile));
        var bodyInfo = JSON.stringify(profileInfo.userProfile);
        res.end(bodyInfo);
    });

    router.get('/isSessionValid', function (req, res) {

        var loginInfo = JSON.parse(JSON.stringify(login));
        var profileInfo = JSON.parse(JSON.stringify(profile));
        var data = profileInfo.credentials;

        data.j_password = new Buffer(data.j_password, 'base64').toString('utf8');

        var jsonBody, jsonRaw;
        xmlToJson(loginInfo.body, { explicitArray: false, ignoreAttrs: true }, function (err, jsonResult) {
            jsonRaw = jsonResult;
            jsonBody = JSON.stringify(jsonResult);
        });

        res.statusCode = loginInfo.response.header.statusCode;
        res.statusMessage = loginInfo.response.header.statusMessagee;

        if (loginInfo.response.header.statusCode === 200) {
            res.setHeader('Set-Cookie', loginInfo.response.header.setCookie);
        } else {
            jsonBody = JSON.stringify(jsonRaw.THDLogin.Error);
        }
        res.end(jsonBody);
    });

    server.use(router);

};

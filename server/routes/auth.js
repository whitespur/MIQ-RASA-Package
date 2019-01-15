var jwt = require('jsonwebtoken');
const db = require('../db/db');
"use strict";
var permissions = {
  0: 'Not Allowed',
  1: 'Read',
  2: 'ReadExpanded',
  3: 'Write',
  4: 'WriteExpanded',
  5: 'Full'
};

var pages = {
  0:'dashboard',
  1:'agents',
  2:'regex',
  3:'training',
  4:'settings',
  5:'insights',
  6:'conversations',
  7:'logs',
  8:'configuration',
  9:'account_center',
  10:'permission_center'
};

var home_url = 'https://api.miq.ai/';
<<<<<<< HEAD
=======

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 53d32f3... Create Account / Route / Auth
=======
=======
>>>>>>> 579c480924b28c26e05c069c6d8b97acf1d2fa4c
>>>>>>> parent of 53d32f3... Create Account / Route / Auth
=======
>>>>>>> parent of 53d32f3... Create Account / Route / Auth
=======
>>>>>>> parent of 53d32f3... Create Account / Route / Auth
=======
>>>>>>> parent of 53d32f3... Create Account / Route / Auth
var components = ['navigation','accounts', 'avgNluResponseTimesLast30Days', 'activeUserCountLast30Days', 'agentsByIntentConfidencePct', 'intentsMostUsed','avgUserResponseTimesLast30Days'];

  onAuthenticate = function(req, res, next) {
      //authenticate user
      console.log("Authenticate User");
      db.one('select * from account where username = $1', [req.body.username])
      .then(function (data) {
        if(data.password == req.body.password) {
          //create token and send it back
          console.log(data);
        var tokenData = {username:data.username,name:data.username,level:data.level,uid:data.user_id};
        // if user is found and password is right
        // create a token
        var token = jwt.sign(tokenData, global.jwtsecret);
        // return the information including token as JSON
        res.json({username: data.username,token: token, uid: data.user_id});
        }
      }).catch(function (err) {
        console.log("Information didnt match or not provided.")
        return res.status(401).send({
            success: false,
            message: 'Username and password didnt match.',
            err: err
        });
      });
  }
  onCanView = function(req, res, next, url) {
    var jwt = req.jwt;
    requestUserPermission(jwt.username, url, next, res, req);
  }
  onDeAuthenticate = function(req, res) {
      //authenticate user
      console.log("Deauthenticate User");
      res.status(200).send({ auth: false, token: null });
  }
  requestUserPermission = function(username, page_name,next, res, req) {
    console.log("auth.requestUserPermissions");
    db.one("SELECT * FROM account WHERE username = '" + username + "'")
      .then(function (permission) {
        backURL=req.header('Referer').split('/')[0] || '/';
        if(permission != '' && isComponent(page_name) == false) {
          db.one("SELECT * FROM navigation WHERE href LIKE '%" + page_name + "%'")
          .then(function (response) {
            backURL=req.header('Referer').split('/')[0] || '/';
            if(response != '') {
              if(permission.level >= response.level) {
                next('route');
              } else {
                return res.status(200).json({
                    success: false,
                    message: 'You cannot view this page.',
                    errCode: 755,
                    redirect: backURL,
                    response: response
                });
              }
            } else {
              return res.status(200).json({
                  success: false,
                  message: 'You cannot view this page.',
                  errCode: 755,
                  redirect: backURL,
                  response: response
              });
            }
          })
          .catch(function (err) {
            if(err.message == 'No data returned from the query.') {
              next('route');
            } else {
              return res.status(200).json({
                  success: false,
                  message: 'You cannot view this page.',
                  errCode: 755,
                  redirect: backURL,
                  response: response
              });
            }
          });
        } else if( isComponent(page_name) !== false && permission.level >= 2) {
            next();
        } else {
          return res.status(200).json({
              success: false,
              message: 'You cannot view this page.',
              errCode: 755,
              redirect: backURL,
              response: permission
          });
        }
      })
      .catch(function (err) {
        return res.status(200).json({
            success: false,
            message: 'You cannot view this page.',
            errCode: 755,
            redirect: backURL,
            response: response
        });
      });
  }
  onAuthClient = function() {
    //authenticate client based on client secret key
    //username,user_fullname,agent_name,client_secret_key should all be present in the body
    console.log("Authenticate Client");
    db.one('select * from agents where agent_name = $1 and client_secret_key=$2', [req.body.agent_name,req.body.client_secret_key])
      .then(function (data) {
        var tokenData = {username:req.body.username,name: req.body.user_fullname};
        // if user is found and password is right
        // create a token
        var token = jwt.sign(tokenData, global.jwtsecret);
        // return the information including token as JSON
        res.status(200).json({username:req.body.username,token: token});
      }).catch(function (err) {
        console.log("Client Authentication error: "+ err);
        return res.status(401).send({
            success: false,
            message: 'Client Authentication failed.'
        });
      });
  }
  
  onIsAuthenticated = function() {

  }

  isComponent = function(name) {
    if(components.indexOf(name) > -1) {
      return true;
    } else { return false;}
  }

module.exports = {
  auth_init           : onAuthenticate,
  auth_check          : onIsAuthenticated,
  auth_deauthenticate : onDeAuthenticate,
  auth_canView        : onCanView
};
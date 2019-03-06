const db = require('./db')

function getAccounts(req, res, next) {
  db.any('SELECT * FROM account')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCurrentAccount(req, res, next) {
  var jwt = req.jwt;
  var username = jwt.username;
  db.any('SELECT * FROM account WHERE username = "' + username + '"')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleAccount(req, res, next) {
  if(req.params.accounts_id == 'current') {
    getCurrentAccount(req,res,next);
  } else {
    var accountID = parseInt(req.params.accounts_id);
    db.one('select * from account where user_id = $1', accountID)
      .then(function (data) {
        res.status(200)
          .json(data);
      }).catch(function (err) {
        return next(err);
      });
  }
}

module.exports = {
  getAccounts: getAccounts,
  getSingleAccount: getSingleAccount,
  getCurrentAccount: getCurrentAccount
};

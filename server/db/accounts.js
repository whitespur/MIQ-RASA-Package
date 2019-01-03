const db = require('./db')

function getAccounts(req, res, next) {
  db.one('select * from account INNER JOIN account_type ON account_type.id = account.account_type')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAccounts: getAccounts
};

const db = require('./db')

function getAccounts(req, res, next) {
  db.one('select * from account as a JOIN account_type as at ON at.id = a.account_type')
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

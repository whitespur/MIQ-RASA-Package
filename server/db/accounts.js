const db = require('./db')

function getAccounts(req, res, next) {
  db.one('select username, email, client_id, created_on, name as account_type_name from account')
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

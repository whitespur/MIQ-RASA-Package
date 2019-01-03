const db = require('./db')

function getAccounts(req, res, next) {
  console.log('TEST::::::::::::::');
  db.any('SELECT * FROM account')
    .then(function (data) {
      console.log(data);
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

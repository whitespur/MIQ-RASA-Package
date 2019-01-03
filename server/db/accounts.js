const db = require('./db')

function getAccounts(req, res, next) {
  db.one('select * from account')
    .then(function (data) {
      res.status(200)
        .json({
          'message': 'hej',
          'test' : true,
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAccounts: getAccounts
};

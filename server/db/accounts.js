const db = require('./db')

function getAccounts(req, res, next) {
  db.one('select * from account')
    .then(function (data) {
      var data = Object.entries(data).map((value)=>(value));
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

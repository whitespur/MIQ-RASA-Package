const db = require('./db')

function getAccounts() {
  db.one('select * from account')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAccounts: getAccounts,
};

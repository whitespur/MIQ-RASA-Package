const db = require('./db')

function getLinks(req, res, next) {
  db.any('SELECT * FROM navigation')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getLinksByLevel(req, res, next) {
  var query = req.params.query;
  console.log('i was here LinksLevel');
  db.any('SELECT * FROM navigation WHERE level <= $1', query)
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
  getLinks: getLinks,
  getLinksByLevel: getLinksByLevel
};
const db = require('./db')

function getSingleIntent(req, res, next) {
  var intentID = parseInt(req.params.intent_id);
  db.one('select * from intents where intent_id = $1', intentID)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAgentIntents(req, res, next) {
  console.log("intents.getAgentIntents");
  var AgentID = parseInt(req.params.agent_id);
  var search = req.query.search;
  if(search !== undefined) {
    db.any('select * from intents where agent_id = $1 AND intent_name LIKE $2  ORDER BY intent_name asc', [parseInt(AgentID), "%" + search + "%"])
    .then(function (data) {
      var ids = data.map(function (data) {
        if (data.agent_id === parseInt(AgentID)) {
          return  data.intent_id;
        } else {
          return null
        }
      });
      db.any('select * from responses where intent_id IN (' +  ids.join(', ') + ') AND response_text LIKE $1 ORDER BY response_text asc', ["%" + search + "%"])
      .then(function (responses) {
        db.any('select * from expressions where intent_id IN (' +  ids.join(', ') + ') AND expression_text LIKE $1 ORDER BY expression_text asc', ["%" + search + "%"])
        .then(function (expressions) {

          res.status(200)
              .json([data, responses, expressions]);
          })
        })
        .catch(function (err) {
          return next(err);
        })
      })
      .catch(function (err) {
        return next(err);
      })
    .catch(function (err) {
      return next(err);
    });
  } else {
    db.any('select * from intents where intents.agent_id = $1 ORDER BY intents.intent_name asc', AgentID)
    .then(function (data) {
      var ids = data.map(function (data) {
        if (data.agent_id === parseInt(AgentID)) {
          return data.intent_id;
        } else {
          return null
        }
      });
      db.any('select * from responses where intent_id IN (' +  ids.join(', ') + ') ORDER BY response_text asc')
    .then(function (responses) {
      db.any('select * from expressions where intent_id IN (' +  ids.join(', ') + ') ORDER BY expression_text asc')
        .then(function (expressions) {
          console.log(expressions);

          res.status(200)
              .json([data, responses, expressions]);
          })
        })
        .catch(function (err) {
          return next(err);
        })
    })
    .catch(function (err) {
      return next(err);
    })
    .catch(function (err) {
      return next(err);
    });
  }
}

function getAgentIntentsWithCombined(req, res, next) {
  var AgentID = parseInt(req.params.agent_id);
  var CombinedIds = req.query.combined_to;
  var IDS;
  if(CombinedIds != undefined ) {
    IDS = CombinedIds + ',' + AgentID;
  } else {
    IDS = AgentID;
  }
  db.any('select * from intents where agent_id IN (' + IDS + ')')
  .then(function (data) {
      res.status(200)
        .json(data);
  })
  .catch(function (err) {
    return next(err);
  });
}

function getUniqueIntents(req, res, next) {
  console.log("intents.getUniqueIntents");
  var IntentID = parseInt(req.params.intent_id);
  db.any('select * from unique_intent_entities where intent_id = $1', IntentID)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createAgentIntent(req, res, next) {
  console.log("intents.createAgentIntent");
  db.any('insert into intents(agent_id, intent_name)' +
      'values(${agent_id}, ${intent_name}) RETURNING intent_id',
    req.body)
    .then(function (resp) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted',
          agent_id: req.body.agent_id
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createIntentTag(req, res, next) {
  console.log("intents.intentTag");
  db.any('insert into intent_tags(category_name)' +
      'values($1) RETURNING tag_id',
    req.body.cat_name)
    .then(function (resp) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted',
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getBindIntentTags(req, res, next) {
  console.log("intents.bindIntentTag");
  db.any('SELECT * FROM intent_tags_binds, intent_tags WHERE intent_tags.intent_id = $1 AND intent_tags.intent_id = intent_tags_binds.intent_id',
    req.body.intent_id)
    .then(function (resp) {
      res.status(200)
        .json(resp);
    })
    .catch(function (err) {
      return next(err);
    });
}

function bindIntentTag(req, res, next) {
  console.log("intents.bindIntentTag");
  db.any('insert into intent_tags_binds(intent_id, tag_id)' +
      'values($1, $2)',
    [req.body.intent_id, req.body.tag_id])
    .then(function (resp) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted',
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getIntentTags(req, res, next) {
  console.log("intents.bindIntentTag");
  var IntentID = parseInt(req.params.intent_id);

  db.any('SELECT * FROM intent_tags_binds ' +
      'where intent_id = $1',
      IntentID)
    .then(function (resp) {
      res.status(200)
        .json(resp);
    })
    .catch(function (err) {
      return next(err);
    });
}



function removeIntent(req, res, next) {
  console.log("intents.removeIntent");
  var intentID = parseInt(req.params.intent_id);
  db.result('delete from intents where intent_id = $1', intentID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed ${result.rowCount}'
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateIntent(req, res, next) {
  console.log("intents.updateIntentEndpoint");
  db.none('update intents set intent_name=$2,endpoint_enabled=$3 where intent_id=$1',
    [parseInt(req.params.intent_id),req.body.intent_name, req.body.endpoint_enabled])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Intent'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getTags(req, res, next) {
  console.log("intents.getTags");
  db.any('SELECT * FROM intent_tags', [])
    .then(function (resp) {
      res.status(200)
        .json(resp);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAgentIntents: getAgentIntents,
  createAgentIntent: createAgentIntent,
  getSingleIntent: getSingleIntent,
  removeIntent: removeIntent,
  getUniqueIntents: getUniqueIntents,
  updateIntent: updateIntent,
  getAgentIntentsWithCombined: getAgentIntentsWithCombined,
  getTags: getTags,
  getIntentTags: getIntentTags,
  bindIntentTag: bindIntentTag,
  createIntentTag: createIntentTag,
  getBindIntentTags: getBindIntentTags

};

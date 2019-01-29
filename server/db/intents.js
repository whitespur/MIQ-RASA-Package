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
      console.log(data);
      var ids = data.map(function (data) {
        if (data.agent_id === parseInt(AgentID)) {
          return data[data.agent_id] = data.intent_id;
        } else {
          return null
        }
      });
      console.log(ids);
      db.any('select * from responses where responses.intent_id IN $1 & responses.response_text LIKE $2 ORDER BY responses.intent_name asc', [ids, "%" + search + "%"])
      .then(function (responses) {
        res.status(200)
            .json({intents: data, responses: responses});
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
          return data[data.agent_id] = data.intent_id;
        } else {
          return null
        }
      });
      console.log(ids);
      db.any('select * from responses where responses.intent_id IN (' +  ids.join(', ') + ') ORDER BY responses.intent_name asc')
    .then(function (responses) {
  

      res.status(200)
          .json({intents: data, responses: responses});
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
  var search = req.query.search;
  var IDS;
  if(CombinedIds != undefined ) {
    IDS = CombinedIds + ',' + AgentID;
  } else {
    IDS = AgentID;
  }
  if(search !== undefined) {
    db.any('select * from intents where agent_id IN (' + IDS + ') AND WHERE intent_name LIKE "%' + search + '%"')
    .then(function (data) {
        res.status(200)
          .json(object(data));
    })
    .catch(function (err) {
      return next(err);
    });
  } else {
    db.any('select * from intents where agent_id IN (' + IDS + ')')
    .then(function (data) {
        res.status(200)
          .json(object(data));
    })
    .catch(function (err) {
      return next(err);
    });
  }
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

module.exports = {
  getAgentIntents: getAgentIntents,
  createAgentIntent: createAgentIntent,
  getSingleIntent: getSingleIntent,
  removeIntent: removeIntent,
  getUniqueIntents: getUniqueIntents,
  updateIntent: updateIntent,
  getAgentIntentsWithCombined: getAgentIntentsWithCombined
};

const db = require('./db')

function startConversation(req, res, next) {
  db.any('SELECT * FROM account')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function onLinkClick(req) {
    console.log(req);
    res.status(200)
        .json(req);
    if(data.destination != undefined && data.conversation_id) {
      console.log("Conversation.onLinkClick");
      data.time = getCurrentTime();
      data.date = getCurrentDate();
      db.any('insert into stat_links(user_id, destination, time, date)' +
            ' values(${user_id},${destination}, ${time},${date})', data)
        .then(function (messages_id) {
            console.log("Click Registered")
            return;
        })
        .catch(function (err) {
            console.log("Error in createMessage" + err);
            //res.status(500).json(err);
            return;
        });
    } else { return; }
}

function getCurrentTime() {
    var date = new Date();
    var current_hour = date.getHours();
    return current_hour;
}

function getCurrentDate() {
    var date = new Date();
    return date.format('y-m-d');
}

function createMessage(messageObj) {
    if (messageObj != undefined && messageObj.agent_id != undefined) {
      console.log("Messages.createUserMessage");
      db.any('insert into messages(agent_id, user_id, user_name, message_text, message_rich, user_message_ind)' +
          ' values(${agent_id}, ${user_id},${user_name}, ${message_text},${message_rich}, ${user_message_ind})', messageObj)
        .then(function (messages_id) {
          console.log("Message created successfully!!!");
          return;
        })
        .catch(function (err) {
          console.log("Error in createMessage" + err);
          //res.status(500).json(err);
          return;
        });
      } else {
        return;
      }
  }

module.exports = {
    onLinkClick: onLinkClick,
    startConversation: startConversation
};

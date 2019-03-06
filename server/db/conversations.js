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

function onLinkClick(req, res, next) {
    var data = req.body;
    var date = new Date();
    var current_hour = date.getHours();
    data.time = current_hour;
    data.date = date;
    data.user_id = req.jwt.uid;
    console.log(data);
    if(data.destination != undefined) {
      console.log("Conversation.onLinkClick");

      console.log(data);
      db.any('insert into stat_links(user_id, destination, time, date)' +
            ' values(${user_id},${destination}, ${time},${date})', data)
        .then(function (messages_id) {
            console.log("Click Registered")
            return;
        })
        .catch(function (err) {
            console.log("Error in createMessage" + err);
            res.status(500).json(err);
            return;
        });
            console.log("Error in createMessage" + err);
        } else {  return; }
}

function getCurrentTime() {

    return current_hour;
}

function getCurrentDate() {

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

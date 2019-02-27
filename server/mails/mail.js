var nodemailer = require('nodemailer');

function sendMail(receiver, subject, text) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mikebsorensen1@gmail.com',
          pass: 'mikeb2595sorensen'
        }
      });
      
      var mailOptions = {
        from: 'mikebsorensen1@gmail.com',
        to: receiver,
        subject: subject,
        text: text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


module.exports = {
    sendMail: sendMail,
};
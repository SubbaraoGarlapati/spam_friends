const http = require('http');
const express = require('express');
const { urlencoded } = require('body-parser');
//const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('./config'); 

const app = express();
app.use(urlencoded({ extended: false }));
const port = config.app.port;

const {addFriendFromVCFLink, listFriendsToMe, forwardToMe, removeNumber, sendMessageToAllFriends} = require('./helpers');
const {addFriend} = require('./queries');

app.post('/sms', (req, res) => {
  //const twiml = new MessagingResponse();

  // Access the message body and the number it was sent from.
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

 // twiml.message('The Robots are coming! Head for the hills!');

 // res.writeHead(200, {'Content-Type': 'text/xml'});
  //res.end(twiml.toString());
  console.log(req.body);
  if (req.body.From == "+16516002589") {
	if (req.body.NumMedia == 1) {
		console.log('VCF');
		addFriendFromVCFLink(req.body.MediaUrl0);
	}

	let splitBody = req.body.Body.split(' ');
	let firstWord = splitBody[0];
	if (firstWord == 'ADD') {
		console.log('ADD');
		let firstName = splitBody[1].replace(/[^a-zA-Z]/g, '');
		let phoneNumber = splitBody[splitBody.length-1].replace(/[^+0-9]/g, '');
		let lastName = splitBody.length == 4 ? splitBody[2].replace(/[^a-zA-Z]/g, '') : '';
	  	if (isNaN(phoneNumber)) {
			return;
		}
		addFriend(phoneNumber, firstName, lastName);
	} else if (firstWord == 'REMOVE') {
		console.log('REMOVE');
		let secondWord = splitBody[1];
		console.log(`Number to remove: ${secondWord}`);
		removeFriend(secondWord);
	} else if (firstWord == 'SEND') {
		console.log('SEND');
		let message = req.body.Body.substr(req.body.Body.indexOf(" ")+1);
		console.log(`Sending message: ${message}`);
		sendMessageToAllFriends(message);
	} else if (firstWord == 'LIST') {
		console.log('LIST');
		listFriendsToMe();
	}

  } else {
	forwardToMe(req.body.Body); 
  }

});

http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});



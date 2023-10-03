const http = require('http');
const express = require('express');
const { urlencoded } = require('body-parser');
//const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('./config'); 

const app = express();
app.use(urlencoded({ extended: false }));
const port = config.app.port;

const {addNumber, removeNumber, sendMessage} = require('./helpers');


app.post('/sms', (req, res) => {
  //const twiml = new MessagingResponse();

  // Access the message body and the number it was sent from.
  console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

 // twiml.message('The Robots are coming! Head for the hills!');

 // res.writeHead(200, {'Content-Type': 'text/xml'});
  //res.end(twiml.toString());
  if (req.body.From == "+16516002589") {
	let splitBody = req.body.Body.split(' ');
	let firstWord = splitBody[0];
	if (firstWord == 'ADD') {
		console.log('ADD');
		let secondWord = splitBody[1];
		console.log(`Number to add: ${secondWord}`);
	  	addNumber(secondWord);
	} else if (firstWord == 'REMOVE') {
		console.log('REMOVE');
		let secondWord = splitBody[1];
		console.log(`Number to remove: ${secondWord}`);
		removeNumber(secondWord);
	} else if (firstWord == 'SEND') {
		console.log('SEND');
		let message = req.body.Body.substr(req.body.Body.indexOf(" ")+1);
		console.log(`Sending message: ${message}`);
		sendMessage(message);
	}

  } else {
 

  }

});

http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});



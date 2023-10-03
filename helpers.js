const fs = require('fs')
const config = require('./config')
const { exec }  = require('child_process');
const twilio = require('twilio');
const accountSid = config.twilio.TWILIO_ACCOUNT_SID;
const authToken = config.twilio.TWILIO_AUTH_TOKEN;
const recipientsFile = config.numbers.recipientsFile;

const client = new twilio(accountSid, authToken);

function addNumber(number) {
	console.log(`addNumber with ${number}`);
	exec(`sh bashScripts/addLine.sh ${number}`);
}


function removeNumber(number) {
	exec(`sh bashScripts/removeLine.sh ${number}`);	
}

function sendMessage(message) {
	console.log(`sendMessage with message ${message}`);
	let recipientArr = fs.readFileSync('/home/ubuntu/recipients.txt').toString().split("\n");
	recipientArr.forEach((recipient) => {
		if (!isValidNumber(recipient)) { return; } 
		console.log(`recipient: ${recipient}`);
		client.messages.create({
			body: message,
			to: recipient,
			from: config.numbers.twilio
		});
	});
}

function isValidNumber(number) {
	test =  /^\+[0-9]{11}$/.test(number);
	console.log(test);
	return test;
}

module.exports = {addNumber, removeNumber, sendMessage}

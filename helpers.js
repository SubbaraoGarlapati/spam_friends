const fs = require('fs')
const config = require('./config')
const { exec }  = require('child_process');
const twilio = require('twilio');
const accountSid = config.twilio.TWILIO_ACCOUNT_SID;
const authToken = config.twilio.TWILIO_AUTH_TOKEN;
const recipientsFile = config.numbers.recipientsFile;
const vcardparser = require('vcardparser');
var https = require('https');
var https = require('follow-redirects').https;

const {addFriend, getAllFriends, removeFriend} = require('./queries');

const client = new twilio(accountSid, authToken);
function addFriendFromVCFLink(url) {
	console.log("addNumberFromVCFLink");
	const file = fs.createWriteStream("/home/ubuntu/friendToAdd.vcf");
	const request = https.get(url, function(response) {
		response.pipe(file);

		// after download completed close filestream
		file.on("finish", () => {
			file.close();
			vcardparser.parseFile("/home/ubuntu/friendToAdd.vcf", function(err, json) {
				if (err) { console.log(err); }
				console.log('parsed VCF file');
				console.log(json);
				fs.unlinkSync("/home/ubuntu/friendToAdd.vcf");
				const phone_number = json.tel[0].value.replace(/[^+0-9]/g, '');
				const first_name = json.n.first.replace(/[^a-zA-Z]/g, '');
				const last_name = json.n.last.replace(/[^a-zA-Z]/g, '');
				addFriend(phone_number, first_name, last_name);
			});
		});
	});
}

async function sendMessageToAllFriends(message) {
	console.log(`sendMessage with message ${message}`);
	const [friends, fields] = await getAllFriends();
        successful_recipients = [];
	unsuccessful_recipients = [];
	friends.forEach((friend) => {
		result = sendMessageToRecipient(message, friend.phone_number);
        	if (result) {
			successful_recipients.push(friend.first_name + " " + friend.last_name);
		} else {
			unsuccessful_recipients.push(friend.first_name + " " + friend.last_name);
		}
	});
	sendMessageToRecipient('Successfully sent to ' + successful_recipients.join(', '),'+16516002589');
	sendMessageToRecipient('Unsuccessfully sent to ' + unsuccessful_recipients.join(', '),'+16516002589');
}

function sendMessageToRecipient(message, recipient) {
	try {
		console.log(`recipient: ${recipient}`);
		client.messages.create({
			body: message,
			to: recipient,
			from: config.numbers.twilio
		});
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
}

async function listFriendsToMe() {
	let message = '';
	console.log('test');
	const [friends, fields] = await getAllFriends();
	console.log('typeof' + typeof friends);
	console.log(friends);
	friends.forEach((friend) => {
		message += friend.first_name == 'NULL' ? '': friend.first_name + ' ';
		message += friend.last_name == 'NULL' ?  '' : friend.last_name;
		message += ' (' + friend.phone_number + ')\n';
	});
	sendMessageToRecipient(message, '+16516002589');
}

module.exports = {addFriendFromVCFLink, listFriendsToMe, sendMessageToAllFriends}

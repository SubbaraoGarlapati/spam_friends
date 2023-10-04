const config = {
	app: {
		port: 3000
	},
	numbers: {
		twilio: +18556570214,
		me: +16516002589,
		recipientsFile: 'recipients.txt'
	},
	twilio: {
		TWILIO_ACCOUNT_SID: 'ACf29be482d385763581e4768f8a8518ae',
		TWILIO_AUTH_TOKEN: 'ecf70f969ea334bce896e50e4a5c72d6'
	},
	db: {
		host: 'localhost',
  		user: 'ubuntu',
  		password: 'your_database_password',
  		database: 'spam_friends_db',
	}
}

module.exports = config;

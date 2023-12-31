const mysql = require('mysql2/promise');
const config = require('config');

//const con = mysql.createConnection({
//  host: conf.db.host,
//  user: conf.db.user,
//  password: conf.db.password,
//  database: conf.db.database
//});

const friends_table = config.get('db.table');

async function getConnection() {
	const con = await mysql.createConnection({
  		host: config.get('db.host'),
  		user: config.get('db.user'),
  		password: config.get('db.password'),
  		database: config.get('db.database')
	});
	return con;
}

async function addFriend(phone_number, first_name, last_name) {
	if (first_name == '') {
		first_name = 'NULL';
	}
	if (last_name == '') {
		last_name = 'NULL';
	}

	const con = await getConnection();

	const query_statement = `INSERT INTO ${friends_table} (phone_number, first_name, last_name) VALUES ('${phone_number}','${first_name}','${last_name}');`;

	con.query(query_statement);
}

async function getAllFriends() {
	const query_statement = `SELECT * FROM ${friends_table};`;

	const con = await getConnection();

	const rows = await con.query(query_statement);
	
	return rows;
}

async function removeFriendByFirstName(first_name) {
	const query_statement = `DELETE FROM ${friends_table} WHERE first_name = '${first_name}'`;

	const con = await getConnection();

	con.query(query_statement);
}

async function removeFriendByPhoneNumber(phone_number) {
        const query_statement = `DELETE FROM ${friends_table} WHERE phone_number LIKE '%${phone_number}%'`;

        const con = await getConnection();

        con.query(query_statement);
}

module.exports = {addFriend, getAllFriends, removeFriendByFirstName, removeFriendByPhoneNumber}

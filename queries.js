const mysql = require('mysql2/promise');
const conf = require('./config');

//const con = mysql.createConnection({
//  host: conf.db.host,
//  user: conf.db.user,
//  password: conf.db.password,
//  database: conf.db.database
//});

const friends_table = conf.db.table;

async function getConnection() {
	const con = await mysql.createConnection({
  		host: conf.db.host,
  		user: conf.db.user,
  		password: conf.db.password,
  		database: conf.db.database
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

module.exports = {addFriend, getAllFriends}

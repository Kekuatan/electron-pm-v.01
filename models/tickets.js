let dbconfig = require('./dbconfig')
var db = dbconfig.db

const insert = db.prepare('REPLACE INTO users (id, name, password, email) VALUES (@id, @name, @password, @email)');

exports.insertMany = db.transaction((cats) => {
    for (const cat of cats) insert.run(cat);
});
let dbconfig = require('./dbconfig')
const db = dbconfig.db

const insert = db.prepare('REPLACE INTO parameters (id, name, value) VALUES (@id, @name, @value)');
const select = db.prepare('SELECT value FROM parameters WHERE name = ?');
// const update = db.prepare('REPLACE INTO parameters (id,name, value) VALUES (?, ?)');
const update = db.prepare('UPDATE parameters SET value = ? WHERE "name" = ?');
exports.insertMany = db.transaction((cats) => {
    for (const cat of cats) insert.run(cat);
});


exports.select = function(name){
    return select.get(name);
}

exports.update = function(name, value) {
    // let a = update.run(run, value);
    let a = update.run(value, name);
    return a;
}


// insertMany([
//     { name: 'Joey', age: 2 },
//     { name: 'Sally', age: 4 },
//     { name: 'Junior', age: 1 },
// ]);
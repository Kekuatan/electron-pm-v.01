let dbconfig = require('./dbconfig')
<<<<<<< Updated upstream
const userModel = require("./users");
var db = dbconfig.db

const replace = db.prepare('REPLACE INTO parameters (id, name, type, value) VALUES (@id, @name, @type, @value)');
//
// let records = [
//     { id: 'a', name: 'company_name', type : 'default', value :'test' },
//     { id: 'b', name: 'company_address', password : 'default', email :'test' },
//     { id: 'c', name: 'company_logo', password : 'default', email :'test' },
//     { id: 'd', name: 'struck_logo', password : 'default', email :'test' },
//     { id: 'e', name: 'struck_in_description', password : 'default', email :'test' },
//     { id: 'f', name: 'struck_out_description', password : 'default', email :'test' },
// ];

// let a = async() =>{
//     await userModel.insertMany([
//         { id: 'Joey', name: 2, password : 'test', email :'test' },
//         { id: 'd', name: 2, password : 'test', email :'test' },
//         { id: 'e', name: 2, password : 'test', email :'test' },
//     ]);
// }
// // a()
exports.replaceMany = db.transaction((records) => {
    for (const record of records) replace.run(record);
});
=======
var db = dbconfig.db

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
>>>>>>> Stashed changes

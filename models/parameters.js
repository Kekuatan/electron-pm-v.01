let dbconfig = require('./dbconfig')
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
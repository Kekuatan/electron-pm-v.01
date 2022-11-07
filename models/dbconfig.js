const Database  = require('better-sqlite3')
const db = new Database('parkir-pm.db', { verbose: console.log });

const createDB = async () => {
    db.exec("CREATE TABLE IF NOT EXISTS area_positions (id INTEGER PRIMARY KEY,name VARCHAR(255),code VARCHAR(255) NOT NULL,vehicle_type VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, address_name VARCHAR(255), lat DECIMAL(8,2), lng DECIMAL(8,2))")
    db.exec("CREATE TABLE IF NOT EXISTS users (id CHAR(36) PRIMARY KEY,name VARCHAR(255), password VARCHAR(255), email VARCHAR(255))")
    // db.exec("CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY,name VARCHAR(255),code VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL)")
    // db.exec("CREATE TABLE IF NOT EXISTS members (id CHAR(36) PRIMARY KEY,name VARCHAR(255),plat_no VARCHAR(255) NOT NULL, card_no VARCHAR(255) NOT NULL, vehicle_id INTEGER NOT NULL)")
    db.exec("CREATE TABLE IF NOT EXISTS tickets (id CHAR(36) PRIMARY KEY, area_position_in_id INTEGER NOT NULL, barcode_no VARCHAR(255), member_id CHAR(36), plat_no VARCHAR(255) NOT NULL, card_no VARCHAR(255), vehicle_id INTEGER )")
    db.exec("CREATE TABLE IF NOT EXISTS parameters (id CHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, type VARCHAR(255), value VARCHAR(255) NOT NULL)")
    // db.exec('CREATE TABLE IF NOT EXISTS test (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME VARCHAR(255) NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);');
    db.exec("CREATE TABLE IF NOT EXISTS parameters (id INTEGER NOT NULL PRIMARY KEY, name VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL )")
}

createDB()
exports.db = db
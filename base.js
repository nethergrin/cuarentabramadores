/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var config = require("./config.js");

var pool = mysql.createPool({
        host : config.db.host,
        user :config.db.user,
        password:config.db.password,
        database:config.db.database,
        connectionLimit:config.db.connectionLimit,
        debug: false
        });
        
exports.pool = pool;
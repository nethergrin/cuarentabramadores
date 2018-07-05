/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
var ldap = require('ldapjs');


var client = ldap.createClient({
  url: 'ldap://127.0.0.1:10389'
});

*/
var logger = require('../logger.js');
var config = require("../config.js");
var crypto = require('crypto');

var mysql = require("mysql");

var pool = mysql.createPool({
    host : config.db.host,
    user :config.db.user,
    password:config.db.password,
    database:config.db.database,
    connectionLimit:config.db.connectionLimit,
    debug: false
});


var AuthenticationService = {
    authenticate: function(user, password, callback) {
        if(config.auth.type==="internal") {
            return this.internalAuthenticate(user, password, callback);
        }
    },
    internalAuthenticate: function (user, password, callback) {
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : er.code, description: err.sqlMessage});

                    return;
                }
                
                cPassword= crypto.createHash('sha512').update(password).digest('hex');
                logger.debug(cPassword);

                query = "select * from usuario where email='"+user+"' AND password = '"+cPassword+"';";

                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       logger.debug("Rows: ");
                       logger.debug(rows);
                       callback(rows);
                   } else {
                       logger.error(err);
                   }
                   return;
                });

            });
    }, 1000);
    }
};


module.exports = AuthenticationService;
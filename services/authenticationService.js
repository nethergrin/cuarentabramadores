/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ldap = require('ldapjs');


var client = ldap.createClient({
  url: 'ldap://127.0.0.1:10389'
});

var logger = require('../logger.js');
var config = require("../config.js");
var crypto = require('crypto');
var database = require("../base.js");


var AuthenticationService = {
    authenticate: function(user, password, callback) {
        if(config.auth.type==="internal") {
            return this.internalAuthenticate(user, password, callback);
        }
    },
    internalAuthenticate: function (user, password, callback) {
            
        cPassword= crypto.createHash('sha512').update(password).digest('hex');
        logger.debug(cPassword);

        query = "select * from usuario where email='"+user+"' AND password = '"+cPassword+"';";
        
        database.executeQuery(query, callback);

        return;

    }
};


module.exports = AuthenticationService;
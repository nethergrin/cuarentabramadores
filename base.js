/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require("./config.js");
var logger = require('./logger.js');

var database = {
    
    executeQuery: function (query, callback) {
        logger.debug("Database Provider: "+config.db.provider);
        logger.debug("Query: "+query);
        
        switch (config.db.provider) {
            case "mysql":
                var mysql = require("mysql");
                pool = mysql.createPool({
                    host : config.db.host,
                    user :config.db.user,
                    password:config.db.password,
                    database:config.db.database,
                    connectionLimit:config.db.connectionLimit,
                    debug: false
                    });
                this.executeMysqlQuery(query, pool, callback);
                break;
                
            case "postgres":
                var pg = require("pg");
                var pool;
                if(config.db.heroku==="true") {
                    pool = pg.Pool({
                        connectionString: config.db.herokuConnectionString
                    });
                } else {
                    pool = pg.Pool({
                    host : config.db.host,
                    user :config.db.user,
                    password:config.db.password,
                    database:config.db.database,
                    max:config.db.connectionLimit,
                    idleTimeoutMillis: 10000
                    });
                }
                
                this.executePostgresQuery(query, pool, callback);
                
                break;
        }
        return;
    },
    executeMysqlQuery: function(query, pool, callback) {
        
        logger.debug("ExecuteMysqlQuery");
        
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    err.error = true;
                    callback(err);
                    return;
                }
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       callback(rows);
                       return;
                   } else {
                        logger.error(err);
                        err.error = true;
                        callback(err);
                        return;
                   }
                });
            });
        }, 1000);
        return;
    },
    executePostgresQuery: function(query, pool, callback) {
        logger.debug("ExecutePostgresQuery");
        
        setTimeout(function() {
            pool.connect(function(err, client) {
                if(err) {
                    logger.error(err);
                    err.error = true;
                    callback(err);
                    return;
                }
                logger.debug("Ejecuto client.query");
                client.query(query, function(err, res) {
                    if(err) {
                        logger.error(err);
                        err.error = true;
                        client.release();
                        callback(err);
                        return;
                    } else {
                        client.release();
                        callback(res.rows);
                        return;
                    }
                });
            });
        },1000);

        return;
    }
    
};
        
module.exports = database;
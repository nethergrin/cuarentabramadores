/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");

var pool = mysql.createPool({
   host : config.db.host,
   user :config.db.user,
   password:config.db.password,
   database:config.db.database,
   connectionLimit:config.db.connectionLimit,
   debug: false
   });

// errores posibles: 
// 1146 ER_NO_SUCH_TABLE
// 1136 ER_WRONG_VALUE_COUNT_ON_ROW
   
var testService = 
{
    testIdDuplicado: function() {
        logger.debug("Inicio test");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    status = {"code" : 100, "status" : "Error in connection database"};
                    return;
                }

                query = "insert into agrupador values (1, 1, 1, 1);";

                //logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       logger.debug("No hubo error");
                       logger.debug(rows);
                   } else {
                       
                       logger.debug("Hay error");
                       logger.debug(err);
                   }
                });

                connection.on('error', function(err){
                    logger.debug(err);
                   status = {"code" : 100, "status" : "Error in connection database"};
                   return;
                });

            });
            return status;
        }, 1000);
    },
    testClaveCompuesta: function() {
        logger.debug("Inicio test");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    status = {"code" : 100, "status" : "Error in connection database"};
                    return;
                }

                query = "insert into rel_prestacion_master_prestacion(id_master_prestacion, id_prestacion) values (1, 8357);";

                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       logger.debug("No hubo error");
                       logger.debug(rows);
                   } else {
                       logger.debug("Hay error");
                       logger.debug(err);
                   }
                });

                connection.on('error', function(err){
                    logger.debug(err);
                    status = {"code" : 100, "status" : "Error in connection database"};
                    return;
                });

            });
            return status;
        }, 1000);
    },
    testDatabase: function() {
        logger.debug("testDatabase");
        this.queryMalArmada();
    },
    queryMalArmada: function() {
        logger.debug("queryMalArmada");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    status = {"code" : 100, "status" : "Error in connection database"};
                    logger.debug(err);
                    return;
                }

                query = "insert into agrupador values (1, 1, 1, 1,1,1,1,1);";

                //logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       logger.debug("No hubo error");
                       logger.debug(rows);
                   } else {
                       logger.debug("Hay error");
                       logger.debug(err);
                   }
                });
            });
            return status;
        }, 1000);
    }
};

module.exports = testService;
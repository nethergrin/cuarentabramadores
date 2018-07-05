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
   
var NomencladorService = 
{
    
    get: function (data, callback) {
        logger.debug("NomencladorService.get");
        setTimeout(function (){
                pool.getConnection(function(err, connection) {
                    if(err) {
                        logger.error(err);
                        callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                        return;
                    }

                    connection.query("select * from nomenclador", function (err, rows){
                       connection.release();
                       if(!err) {
                           rs = {code: 201, status:"OK", rs: rows};
                           callback(rs);
                       } else {
                            logger.error(err);
                            callback({"code": 101, status: err.code, description: err.sqlMessage });
                            return;
                       }
                    });

                    

                });
        }, 1000);
    },
    post: function(data, callback) {
        logger.debug("NomencladorService.POST");
        setTimeout(function (){
                pool.getConnection(function(err, connection) {
                    if(err) {
                        logger.error(err);
                        callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                        return;
                    }
                    query = "insert into nomenclador (nombre) values ('"+data.nombre+"');";
                    logger.debug(query);
                    connection.query(query, function (err, rows){
                        connection.release();
                        if(!err) {
                           rs = {code: 201, status:"Created", rs: rows};
                           callback(rs);
                           return
                        } else {
                            logger.error(err);
                            status = {code: 101, status: err.code, description: err.sqlMessage};
                            callback(status);
                            return;
                        }
                    });

                });
        }, 1000);
    }
};

module.exports = NomencladorService;


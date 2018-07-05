/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");

//var //logger = require("..///logger.js");

var pool = mysql.createPool({
   host : config.db.host,
   user :config.db.user,
   password:config.db.password,
   database:config.db.database,
   connectionLimit:config.db.connectionLimit,
   debug: false
   });
   
relPrestacionMasterPrestacionService = 
{
    get: function(data, callback) {
        logger.info("relPrestacionMasterPrestacionService.get");
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "select * from rel_prestacion_master_prestacion ";

                filtro = "";
                if(data.id) {
                    filtro = filtro + " id = "+data.id;
                }

                if(data.id_prestacion) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " id_prestacion = "+data.id_prestacion;
                }

                if(data.id_master_prestacion) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " id_master_prestacion ="+data.id_master_prestacion;
                }

                if(filtro!="") {
                    query = query+" where "+filtro;
                }
                logger.info(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       callback(rows);
                   } else {
                        logger.error(err);
                        status = {"code" : 101, "status" : err.code, description: err.sqlMessage};
                        callback(status);
                        return;
                   }
                });
            });
        }, 1000);
    },
    post: function(data, callback) {
        //logger.info("relPrestacionMasterPrestacionService.POST");
        //logger.info(JSON.stringify(data));
        
        for(i=0; i<data.length; i++) {
            if(data[i].hasOwnProperty("id") && data[i].hasOwnProperty("id_prestacion") && data[i].hasOwnProperty("id_master_prestacion")) {
                //logger.info("Estructura correcta");
                if(data[i].id == "" || data[i].id == null) {
                    if(data[i].id_prestacion != null && data[i].id_prestacion != "" && data[i].id_master_prestacion != null && data[i].id_master_prestacion != "") {
                        //logger.info("Están todos los datos, intento insertar");
                        this.insertarRelacionPrestacionMasterPrestacion(data[i].id_prestacion, data[i].id_master_prestacion, callback);
                    } else {
                        //logger.info("Faltan datos");
                        respuesta = {code: 400, status: "Faltan datos (id_prestacion o id_master_prestacion)"};
                        callback(respuesta);
                    }
                } else {
                    //logger.info("Hay un ID, no debería hacer insert");
                    respuesta = {code: 400, status: "El contiene un elemento ID, debería usarse PUT?"};
                    callback(respuesta);
                }

            } else {
                respuesta = {code: 400, status: "Datos mal formados"};
                callback(respuesta);
            }
        }
            
            
    },
    insertarRelacionPrestacionMasterPrestacion: function(id_prestacion, id_master_prestacion, callback) {
        //logger.info("relPrestacionMasterPrestacionService.insertarRelacionPrestacionMasterPrestacion");
        respuesta = {};
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    callback({"code" : 100, "status" : "Error in connection database"});
                    return;
                }
                query = "insert into rel_prestacion_master_prestacion (id_prestacion, id_master_prestacion) values ( "+id_prestacion+","+id_master_prestacion+")";
                //logger.info(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       //callback(rows);
                       //logger.info("No hubo errores en la query");
                       respuesta = {code: 201, status: "OK"};
                       callback(respuesta);
                       return;
                   } else {
                       callback(err);
                   }
                });
                connection.on('error', function(err){
                   //callback({"code" : 100, "status" : "Error in connection database"});
                   respuesta = {"code" : 100, "status" : "Error in connection database"};
                   callback(respuesta);
                   return;
                });

            });
        }, 1000);
    }
};
module.exports =relPrestacionMasterPrestacionService;
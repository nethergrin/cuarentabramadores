/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");
var database = require("../base.js");

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
        
        database.executeQuery(query, callback);


    },
    post: function(data, callback) {
        logger.info("relPrestacionMasterPrestacionService.POST");
        
        
        logger.debug("data: ");
        logger.debug(data);
    
        if (data.id!=="" && data.id !== null) {
        // PUT
            respuesta = {error: true, code: 400, status: "Los datos son incorrectos"};
            callback(respuesta);
        } else {
            if(data.id_master_prestacion === null || data.id_master_prestacion ==="" || data.id_prestacion === null || data.id_prestacion ==="") {
                respuesta = {error: true, code: 400, status: "Los datos son incorrectos"};
                callback(respuesta);
            } else {
                query = "insert into rel_prestacion_master_prestacion (id_prestacion, id_master_prestacion) values ( "+data.id_prestacion+","+data.id_master_prestacion+")";
                database.executeQuery(query, callback);
            }
        }
        return;
    }
};
module.exports =relPrestacionMasterPrestacionService;
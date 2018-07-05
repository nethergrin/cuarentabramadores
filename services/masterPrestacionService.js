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
            

   
var MasterPrestacionService = 
{
    get: function (data, callback) {
            logger.debug("MasterPrestacionService.get");
            setTimeout(function (){
                    pool.getConnection(function(err, connection) {
                        if(err) {
                            logger.error(err);
                            callback({"code" : 100, "status" : er.code, description: err.sqlMessage});
                            
                            return;
                        }

                        query = "select mp.* from master_prestacion mp ";

                        filtro = "";
                        if(data.id) {
                            filtro = filtro + " mp.id = "+data.id;
                        }

                        if(data.nombre) {
                            if(filtro!="") {filtro = filtro+" AND ";}
                            filtro = filtro + " mp.nombre like('%"+data.nombre.replace(" ", "%")+"%')";
                        }

                        if(data.id_prestacion) {
                            if(filtro!="") {filtro = filtro+" AND ";}
                            query = query + " inner join rel_prestacion_master_prestacion rpmp on rpmp.id_master_prestacion = mp.id "
                            filtro = filtro + " rpmp.id_prestacion = "+ data.id_prestacion;
                        }

                        if(filtro!="") {
                            query = query+" where "+filtro;
                        }
                        logger.debug(query);
                        connection.query(query, function (err, rows){
                           connection.release();
                           if(!err) {
                               callback(rows);
                           } else {
                               logger.error(err);
                               callback({"code" : 101, "status" : err.code, description: err.sqlMessage});
                           }
                           return;
                        });

                    });
            }, 1000);
    },
    post: function(data, callback) {
        
        respuesta = "Se hizo un post";
        if(data.hasOwnProperty("id") && data.hasOwnProperty("nombre") && data.hasOwnProperty("es_practica") && data.hasOwnProperty("concept_id")&data.hasOwnProperty("preparacion")) {
            if(data.id=="" || data.id == null ){
                this.insertMasterPrestacion(data.nombre, data.es_practica, data.concept_id, data.preparacion, callback);
            } else {
                // Tiene id, debería ir por put?
                respuesta= {code:400, status: "Va por put"};
                callback(respuesta);
            }
        } else {
            // No tiene la estructura, rechazo
            respuesta = {code:  400, status: "Datos mal formados"};
            callback(respuesta);
        }
        return;
        
    },
    delete: function(data, callback) {
        var pool = mysql.createPool({
                host : config.db.host,
                user :config.db.user,
                password:config.db.password,
                database:config.db.database,
                connectionLimit:config.db.connectionLimit,
                debug: false
                });
        if(data.id) {
            setTimeout(function (){
                pool.getConnection(function(err, connection) {
                    if(err) {
                        logger.error(err);
                        callback({"code" : 100, status: err.code, description: err.sqlMessage});
                        return;
                    }

                    query = "delete from master_prestacion where id = "+data.id;

                    logger.debug(query);
                    
                    connection.query(query, function (err, rows){
                       connection.release();
                       if(!err) {
                           callback(rows);
                       } else {
                           logger.error(err);
                           callback({code: 101, status: err.code, description: err.sqlMessage});
                       }
                    });

                });
            }, 1000);
        }
    },
    put: function (data, callback){

        logger.debug("MasterPrestacionService.PUT");
        logger.debug(data);
        logger.debug(data.id);
        // Primero valido la estructura del dato
        if(data.hasOwnProperty("id") && data.hasOwnProperty("nombre") && data.hasOwnProperty("es_practica") && data.hasOwnProperty("concept_id")&data.hasOwnProperty("preparacion")) {
            logger.debug("estructura validada, pasa");
            // Segundo valido si tiene ID. Si tiene, puedo actualizar
            if(data.id != "" && data.id != null){
                logger.debug("tiene id, pasa");
                this.updateMasterPrestacion(data.id, data.nombre, data.es_practica, data.concept_id, data.preparacion, callback);
                return;
            } else {
                // No tiene ID, debería ir por POST
                logger.debug("no tiene id, no pasa");
                respuesta = {code: 400, status: "Debería ir por post?"};
                callback(respuesta);
                return;
            }
        } else {
            // No tiene la estructura, rechazo
            logger.debug("estructura no valida, no pasa");
            respuesta = {code:  400, status: "Datos mal formados"};
            callback(respuesta);
            return;
        }
  1  },
    insertMasterPrestacion: function(nombre, es_practica, concept_id, preparacion, callback) {
        status={};
        setTimeout(function (){
                pool.getConnection(function(err, connection) {
                    if(err) {
                        logger.error(err);
                        status = {"code" : 100, status: err.code, description: err.sqlMessage};
                        callback(status);
                        return;
                    }
                    
                    if(concept_id == "") {
                        concept_id = "null";
                    }
                    
                    nombre = connection.escape(nombre);
                    es_practica=connection.escape(es_practica);
                    preparacion=connection.escape(preparacion);
                    concept_id=connection.escape(concept_id);
                    
                    query = "insert into master_prestacion(nombre, es_practica, concept_id, preparacion) values ('"+nombre+"',"+es_practica+","+concept_id+",'"+preparacion+"')";
                    logger.debug(query);
                    
                    connection.query(query, function (err, rows){
                        
                        connection.release();
                        if(!err) {
                            logger.debug("No hay errores con la query");
                            status = {code: 201, status: "OK"};
                            callback(status);
                            return;
                       } else {
                           logger.error(err);
                            callback({"code" : 101, status: err.code, description: err.sqlMessage});
                           return;
                       }
                    });

                    
                });
            }, 1000);
        
    },
    updateMasterPrestacion: function(id, nombre, es_practica, concept_id, preparacion, callback) {
        logger.debug("MasterPrestacionService.updateMasterPrestacion");
        
        status={};
        setTimeout(function (){
                pool.getConnection(function(err, connection) {
                    if(err) {
                        status = {"code" : 100, status: err.code, description: err.sqlMessage};
                        logger.error(err);
                        callback(status);
                        return;
                    }
                    logger.debug("Hay conexion a la bd");
                    query = "update master_prestacion set nombre = '"+nombre+"', es_practica = "+es_practica+", concept_id = "+concept_id+", preparacion = '"+preparacion+"' where id = "+id+";"
                    logger.debug(query);
                    
                    connection.query(query, function (err, rows){
                        connection.release();
                        if(!err) {
                           logger.debug("No hay error al ejecutar query");
                           status = {code: 205, status: "OK"};
                           callback(status);
                           return;
                       } else {
                            logger.error(err);
                            callback({"code" : 101, status: err.code, description: err.sqlMessage});
                            return;
                       }
                    });

                    
                });
            }, 1000);
    }
};

module.exports = MasterPrestacionService;
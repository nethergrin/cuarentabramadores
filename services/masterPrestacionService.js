/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");
var database = require("../base.js");


   
var MasterPrestacionService = 
{
    get: function (data, callback) {
            logger.debug("MasterPrestacionService.get");
            
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
            
            database.executeQuery(query, callback);
    },
    post: function(data, callback) {
        
        respuesta = "Se hizo un post";
        if(data.hasOwnProperty("id") && data.hasOwnProperty("nombre") && data.hasOwnProperty("es_practica") && data.hasOwnProperty("concept_id")&data.hasOwnProperty("preparacion")) {
            if(data.id=="" || data.id == null ){
                if(data.concept_id == "") {
                    data.concept_id = 'null';
                }
                query = "insert into master_prestacion(nombre, es_practica, concept_id, preparacion) values ('"+data.nombre+"',"+data.es_practica+","+data.concept_id+",'"+data.preparacion+"')";
                database.executeQuery(query, callback);
                return;
            } else {
                // Tiene id, debería ir por put?
                respuesta= {error: true, code:400, status: "Va por put"};
                callback(respuesta);
            }
        } else {
            // No tiene la estructura, rechazo
            respuesta = {error: true, code:  400, status: "Datos mal formados"};
            callback(respuesta);
        }
        return;
        
    },
    delete: function(data, callback) {
        query = "delete from master_prestacion where id = "+data.id;
        database.executeQuery(query, callback);
        return;
    },
    
    put: function (data, callback){

        logger.debug("MasterPrestacionService.PUT");
        // Primero valido la estructura del dato
        if(data.hasOwnProperty("id") && data.hasOwnProperty("nombre") && data.hasOwnProperty("es_practica") && data.hasOwnProperty("concept_id")&data.hasOwnProperty("preparacion")) {
            logger.debug("estructura validada, pasa");
            // Segundo valido si tiene ID. Si tiene, puedo actualizar
            if(data.id != "" && data.id != null){
                logger.debug("tiene id, pasa");
                if (data.concept_id == "") {
                    data.concept_id = 'null';
                }
                query = "update master_prestacion set nombre = '"+data.nombre+"', es_practica = "+data.es_practica+", concept_id = "+data.concept_id+", preparacion = '"+data.preparacion+"' where id = "+data.id+";"
                database.executeQuery(query, callback);
                return;
            } else {
                // No tiene ID, debería ir por POST
                logger.debug("no tiene id, no pasa");
                respuesta = {error: true, code: 400, status: "Debería ir por post?"};
                callback(respuesta);
                return;
            }
        } else {
            // No tiene la estructura, rechazo
            logger.debug("estructura no valida, no pasa");
            respuesta = {error: true, code:  400, status: "Datos mal formados"};
            callback(respuesta);
            return;
        }
    }
};

module.exports = MasterPrestacionService;
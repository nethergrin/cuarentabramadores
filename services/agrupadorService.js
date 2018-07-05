/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var config = require("../config.js");
var logger = require('../logger.js');




var pool = mysql.createPool({
   host : config.db.host,
   user :config.db.user,
   password:config.db.password,
   database:config.db.database,
   connectionLimit:config.db.connectionLimit,
   debug: false
   });
   
   
var AgrupadorService = 
{
    get: function (data, callback) {
        logger.debug("agrupadorService.get");
        logger.debug(data);
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    logger.error(err);
                    return;
                }

                select = "select a.* ";
                from = " from agrupador a "

                if(data.v=="full") {
                    select = select+", n.nombre as nomenclador_nombre "
                    from = from + " inner join nomenclador n on n.id = a.id_nomenclador "
                }

                query = select + from;

                filtro = "";
                if(data.id) {
                    filtro = filtro + " a.id = "+data.id;
                }

                if(data.descripcion) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " a.descripcion like('%"+data.descripcion.replace(" ", "%")+"%')";
                }

                if(data.codigo) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " a.codigo ="+data.codigo;
                }

                if(data.id_nomenclador) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " a.id_nomenclador ="+data.id_nomenclador;
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
                       status = {code: 101, status: err.code, description: err.sqlMessage};
                       callback(status);
                   }
                });


            });
        }, 1000);
    },
    post: function(data, callback) {
        logger.debug("agrupadorService.post");
        if(data.hasOwnProperty("id") && data.id != "" && data.id != null) {
            // El dato ya exista, no debería aceptarlo por POST, debería venir por PUT
        } else {
            if(data.hasOwnProperty("codigo") && data.hasOwnProperty("descripcion") && data.hasOwnProperty("id_nomenclador") && data.id_nomenclador != null && data.id_nomenclador != "") {
                resultado = this.insertarAgrupador(data.codigo, data.descripcion, data.id_nomenclador);

            } else {
                resultado = {code: 400, status: "Los datos son incorrectos"};
            }
            callback(resultado);
        }
    },
    put: function (data, callback) {
        logger.debug("agrupadorService.put");
        if(data.hasOwnProperty("id") && (data.id == "" || data.id == null)) {
            // El dato no existe, debería aceptarlo por POST, no por PUT
        } else {
             if(data.hasOwnProperty("codigo") && data.hasOwnProperty("descripcion") && data.hasOwnProperty("id_nomenclador") && data.id_nomenclador !== null && data.id_nomenclador !== "") {
                resultado = this.updateAgrupador(data.codigo, data.descripcion, data.id_nomenclador);

            } else {
                resultado = {code: 400, status: "Los datos son incorrectos"};
            }
            callback(resultado);
        }
    },
    insertarAgrupador: function (codigo, descripcion, id_nomenclador) {
        logger.debug("insertAgrupador");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "insert into agrupador (codigo, descripcion, id_nomenclador) values ('"+codigo+"','"+descripcion+"',"+id_nomenclador+");";

                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       status = {code: 201, status: "Created"};
                   } else {
                       logger.error(err);
                       status = {code: 101, status: err.code, description: err.sqlMessage};
                   }
                });

                

            });
            return status;
        }, 1000);
    },
    updateAgrupador: function(id_agrupador, codigo, descripcion, id_nomenclador) {
        logger.debug("updateAgrupador");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "update agrupador set codigo = "+codigo+", descripcion = "+descripcion+", id_nomenclador = "+id_nomenclador+" where id_agrupador = "+id_agrupador+";";

                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       status = {code: 201, status: "Created"};
                   } else {
                       logger.error(err);
                       status = {code: 101, status: err.code, description: err.sqlMessage};
                   }
                });
            });
            return status;
        }, 1000);
    }
};

module.exports = AgrupadorService;
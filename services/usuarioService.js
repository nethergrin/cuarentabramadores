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
   
   
var UsuarioService = 
{
    get: function (data, callback) {
        logger.debug("UsuarioService.get");
        logger.debug(data);
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    logger.error(err);
                    return;
                }

                select = "select * ";
                from = " from usuario ";

                query = select + from;

                filtro = "";
                if(data.id) {
                    filtro = filtro + " id = "+data.id;
                }

                if(data.descripcion) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " nombre like('%"+data.nombre.replace(" ", "%")+"%')";
                }

                if(data.codigo) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " apellido ="+data.apellido.replace(" ", "%")+"%')";
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
        logger.debug("usuarioService.post");
        if(data.hasOwnProperty("id") && data.id != "" && data.id != null) {
            // El dato ya exista, no debería aceptarlo por POST, debería venir por PUT
        } else {
            if(data.hasOwnProperty("nombre") && data.hasOwnProperty("apellido") && data.hasOwnProperty("password")) {
                resultado = this.insertarUsuario(data.nombre, data.apellido, data.password);

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
    insertarUsuario: function (nombre, apellido, password) {
        logger.debug("insertarUsuario");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "insert into usuario (nombre, apellido, password) values ('"+nombre+"','"+apellido+"',"+password+");";

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
    updateAgrupador: function(id, nombre, apellido) {
        logger.debug("updateAgrupador");
        setTimeout(function (){
            status = {};
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "update agrupador set nombre = "+nombre+", apellido = "+apellido+" where id = "+id+";";

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

module.exports = UsuarioService;
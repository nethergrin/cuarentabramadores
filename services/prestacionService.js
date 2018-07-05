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
   
   
var PrestacionService = 
{
    get: function (data, callback) {
        logger.debug("PrestacionService.get");
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }
                
                select = "select p.id, p.descripcion, p.id_agrupador, p.codigo, p.inclusiones, p.exclusiones, p.detalle, count(pmp.id) as paridad "
                from = " from prestacion p left join rel_prestacion_master_prestacion pmp on p.id = pmp.id_prestacion ";
                group_by = " group by p.id, p.descripcion, p.id_agrupador, p.codigo, p.inclusiones, p.exclusiones, p.detalle";
                
                if(data.v=="full") {
                    select = select + ", a.codigo as agrupador_codigo, a.descripcion as agrupador_descripcion, a.id_nomenclador ";
                    select = select + ", n.nombre as nomenclador_nombre";
                    from = from + " inner join agrupador a on a.id = p.id_agrupador ";
                    from = from + " inner join nomenclador n on n.id = a.id_nomenclador ";
                    group_by = group_by + ", a.codigo, a.descripcion, a.id_nomenclador ";
                    group_by = group_by + ", n.nombre ";
                };
                
                filtro = "";
                if(data.id) {
                    filtro = filtro + " p.id = "+data.id;
                }

                if(data.descripcion) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " p.descripcion like('%"+data.descripcion.replace(" ", "%")+"%')";
                }

                if(data.id_agrupador) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " p.id_agrupador ="+data.id_agrupador;
                }

                if(data.codigo) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " p.codigo ="+data.codigo;
                }
                
                if(data.id_nomenclador) {
                    if(filtro!="") {filtro = filtro+" AND ";}
                    filtro = filtro + " p.id_agrupador in (Select id from agrupador where id_nomenclador = "+data.id_nomenclador+") ";
                }
                
                query = select + from;
                if(filtro!="") {
                    query = query+" where "+filtro;
                }
                query = query + group_by;

                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                        callback(rows);
                   } else {
                        logger.error(err);
                        callback({"code" : 101, "status" : err.code, description: err.sqlMessage});
                   }
                });

            });
        }, 1000);
    },
    post: function(data, callback) {
        logger.debug("relPrestacionMasterPrestacionService POST");
        logger.debug("length: "+data.length);
        logger.debug("data: ");
        logger.debug(data);
        respuesta = {};
        if (!data || data.length ===undefined || data.length<=0 ) {
            logger.debug("No hay datos")
            respuesta = {code: 400, status: "No hay datos"};
        } else {
            logger.debug("Hay varios?");
            for(i=0; i<data.length; i++) {
                if (data[i].id!=="" && data[i].id != null) {
                // PUT
                } else {
                    if(data[i].codigo == null || data[i].codigo =="") {
                        respuesta = {code: 400, status: "Los datos son incorrectos"};
                    } else {
                        res = this.insertarPrestacion(data[i].codigo, data[i].descripcion, data[i].agrupador, data[i].detalle, data[i].exclusiones, data[i].inclusiones);
                        if(res.code == 100) {
                            respuesta = {code: 100, status: "Error en la bd"};
                        }
                    }
                }
            }
        }
        callback(respuesta);
    },
    deleteRelMasterPrestacion: function(data, callback) {
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }

                query = "delete from rel_prestacion_master_prestacion where id_master_prestacion = "+data.id_master_prestacion+" AND id_prestacion = "+data.id_prestacion;
                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                        callback(rows);
                        return;
                   } else {
                        logger.error(err);
                        callback({"code" : 101, "status" : err.code, description: err.sqlMessage});
                   }
                });

            });
        }, 1000);
    },
    insertarPrestacion: function(codigo, descripcion, id_agrupador,detalle, exclusiones, inclusiones) {
        status = "";
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    status = {"code" : 100, "status" : err.code, description: err.sqlMessage};
                }

                query = "insert into prestacion (codigo, descripcion, id_agrupador,detalle, exclusiones, inclusiones) values ("+codigo+", "+descripcion+", "+id_agrupador+", "+detalle+", "+exclusiones+", "+inclusiones+")";
                logger.debug(query);
                connection.query(query, function (err, rows){
                   connection.release();
                   if(!err) {
                       status = {code: 201, status: "Created"};
                   } else 
                        logger.error(err);
                        status = {"code" : 101, "status" : err.code, description: err.sqlMessage};
                });

            });
        }, 1000);

        return status;
    },
    comparacion: function(data, callback) {
        logger.debug("PrestacionService.get");
        setTimeout(function (){
            pool.getConnection(function(err, connection) {
                if(err) {
                    logger.error(err);
                    callback({"code" : 100, "status" : err.code, description: err.sqlMessage});
                    return;
                }
                
                id_prestacion = data.id;
                select = "select mp.id as mp_id, mp.nombre as mp_nombre, n.nombre as n_nombre, a.codigo as a_codigo, a.descripcion as a_descripcion, p2.id as p_id, p2.codigo as p_codigo, p2.descripcion as p_descripcion ";
                from = " from rel_prestacion_master_prestacion rpmp ";
                from = from + " inner join master_prestacion mp on mp.id = rpmp.id_master_prestacion ";
                from = from + " inner join rel_prestacion_master_prestacion rpmp2 on rpmp2.id_master_prestacion = mp.id ";
                from = from + " inner join prestacion p2 on p2.id = rpmp2.id_prestacion ";
                from = from + " inner join agrupador a on a.id = p2.id_agrupador ";
                from = from + " inner join nomenclador n on n.id = a.id_nomenclador ";
                where = " where rpmp.id_prestacion = "+id_prestacion;
                
                query = select + from + where;
                
                connection.query(query, function (err, rows){
                    if(!err) {
                        callback(rows);
                    } else {
                        logger.error(err);
                        logger.error(query);
                        callback({"code" : 101, "status" : err.code, description: err.sqlMessage});
                    }
                });
                return;
            });
        }, 1000);
    }
};

module.exports = PrestacionService;
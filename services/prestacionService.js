/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");
var database = require("../base.js");

//var pool = mysql.createPool({
//   host : config.db.host,
//   user :config.db.user,
//   password:config.db.password,
//   database:config.db.database,
//   connectionLimit:config.db.connectionLimit,
//   debug: false
//   });
   
   
var PrestacionService = 
{
    get: function (data, callback) {
        logger.debug("PrestacionService.get");
        
        select = "select p.id, p.descripcion, p.id_agrupador, p.codigo, p.inclusiones, p.exclusiones, p.detalle, count(pmp.id) as paridad "
        from = " from prestacion p left join rel_prestacion_master_prestacion pmp on p.id = pmp.id_prestacion ";
        group_by = " group by p.id, p.descripcion, p.id_agrupador, p.codigo, p.inclusiones, p.exclusiones, p.detalle";

        if(data.v==="full") {
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
        
        database.executeQuery(query, callback);
                
        
    },
    post: function(data, callback) {
        /*
         * @todo Rehacer esta parte
         */
        logger.debug("PrestacionService POST");
        logger.debug("data: ");
        logger.debug(data);
    
        if (data.id!=="" && data.id != null) {
        // PUT
            respuesta = {error: true, code: 400, status: "Los datos son incorrectos"};
            callback(respuesta);
        } else {
            if(data.codigo == null || data.codigo =="") {
                respuesta = {error: true, code: 400, status: "Los datos son incorrectos"};
                callback(respuesta);
            } else {
                query = "insert into prestacion (codigo, descripcion, id_agrupador,detalle, exclusiones, inclusiones) values (";
                query = query + data.codigo+", '"+data.descripcion+"', "+data.id_agrupador+", '"+data.detalle+"', '"+data.exclusiones+"', '"+data.inclusiones+"')";
                database.executeQuery(query, callback);
            }
        }
        return;
    },
    deleteRelMasterPrestacion: function(data, callback) {
        
        query = "delete from rel_prestacion_master_prestacion where id_master_prestacion = "+data.id_master_prestacion+" AND id_prestacion = "+data.id_prestacion;
        database.executeQuery(query, callback);
    },
    
    comparacion: function(data, callback) {
        logger.debug("PrestacionService.get");
        
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
        
        database.executeQuery(query, callback);
        
    }
};

module.exports = PrestacionService;
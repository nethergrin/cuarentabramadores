/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mysql = require("mysql");
var config = require("../config.js");
var logger = require('../logger.js');
var database = require("../base.js");


//
//var pool = mysql.createPool({
//   host : config.db.host,
//   user :config.db.user,
//   password:config.db.password,
//   database:config.db.database,
//   connectionLimit:config.db.connectionLimit,
//   debug: false
//   });
//   
   
var AgrupadorService = 
{
    get: function (data, callback) {
        logger.debug("agrupadorService.Get");
        logger.debug(data);
        
        select = "select a.* ";
        from = " from agrupador a ";
        
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
        
        database.executeQuery(query, callback);
        
    },
    post: function(data, callback) {
        logger.debug("agrupadorService.post");
        if(data.hasOwnProperty("id") && data.id != "" && data.id != null) {
            // El dato ya exista, no debería aceptarlo por POST, debería venir por PUT
            resultado = {code: 400, status: "Los datos son incorrectos (debería ir por PUT)"};
            callback(resultado);
        } else {
            if(data.hasOwnProperty("codigo") && data.hasOwnProperty("descripcion") && data.hasOwnProperty("id_nomenclador") && data.id_nomenclador != null && data.id_nomenclador != "") {
                query = "insert into agrupador (codigo, descripcion, id_nomenclador) values ('"+data.codigo+"','"+data.descripcion+"',"+data.id_nomenclador+");";
                database.executeQuery(query, callback);

            } else {
                resultado = {code: 400, status: "Los datos son incorrectos (faltan datos)"};
                callback(resultado);
            }   
        }
        return;
    },
    put: function (data, callback) {
        logger.debug("agrupadorService.put");
        if(data.hasOwnProperty("id") && (data.id == "" || data.id == null)) {
            // El dato no existe, debería aceptarlo por POST, no por PUT
            resultado = {code: 400, status: "Los datos son incorrectos (debería ir por POST)"};
            callback(resultado);
        } else {
             if(data.hasOwnProperty("codigo") && data.hasOwnProperty("descripcion") && data.hasOwnProperty("id_nomenclador") && data.id_nomenclador !== null && data.id_nomenclador !== "") {
                query = "update agrupador set codigo = "+data.codigo+", descripcion = '"+data.descripcion+"', id_nomenclador = "+data.id_nomenclador+" where id = "+data.id+";";
                database.executeQuery(query, callback);
            } else {
                resultado = {code: 400, status: "Los datos son incorrectos (faltan datos)"};
                callback(resultado);
            }
        }
        return;
    }
};

module.exports = AgrupadorService;
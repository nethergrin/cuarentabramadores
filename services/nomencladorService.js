/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mysql = require("mysql");
var logger = require('../logger.js');
var config = require("../config.js");
var database = require("../base.js");
   
var NomencladorService = 
{
    
    get: function (data, callback) {
        logger.debug("NomencladorService.get");
        
        query = "select * from nomenclador";
        
        database.executeQuery(query, callback);
        
    },
    post: function(data, callback) {
        logger.debug("NomencladorService.POST");
        
        query = "insert into nomenclador (nombre) values ('"+data.nombre+"');";
        
        database.executeQuery(query, callback);
        
    }
};

module.exports = NomencladorService;


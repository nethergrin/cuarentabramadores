/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = {};

config.db = {};
config.auth = {};

//config.db.provider = "mysql";
//config.db.user = "nomenclador";
//config.db.password = "nomenclador";
//config.db.host = "127.0.0.1";
//config.db.database = "nomenclador";
//config.db.connectionLimit = "100";

config.db.env="true"; // Defino si uso las variables de ambiente para armar la connectionString

config.db.provider = "postgres";
config.db.user = "u33366954";
config.db.password = "VentasADS";
config.db.host = "127.0.0.1";
config.db.database = "snomed";
config.db.connectionLimit = "100";

config.auth.type = "internal";

config.logger = {};
config.logger.level = "debug";
config.logger.file = "log.log";

module.exports = config;
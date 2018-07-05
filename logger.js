/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var log4js = require('log4js');
var config = require("./config.js");

config = {
    appenders: {
        file: {type: 'file', filename: './log/'+config.logger.file}
    },
    categories: {
        default: {appenders: ['file'],level: config.logger.level}
    }
};

log4js.configure(config);
var logger = log4js.getLogger();

module.exports = logger;
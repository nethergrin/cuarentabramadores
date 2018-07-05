/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var express = require("express"), bodyParser = require("body-parser"); 
var config = require("./config");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

nomenclador_service = require("./services/nomencladorService.js");
agrupadorService = require("./services/agrupadorService.js");
masterprestacion_service = require("./services/masterPrestacionService.js");
prestacion_service = require("./services/prestacionService.js");
relPrestacionMasterPrestacionService = require("./services/relPrestacionMasterPrestacionService.js");
testService = require("./services/testService.js");
logger = require('./logger.js');
json2csv = require ("json2csv");

authenticationService = require("./services/authenticationService.js");


function procesarFormato(req, res, result) {
    
};

app.use('/', express.static(__dirname + '/app'));

app.route('/nomenclador')
    .get(function(req, res) {
        logger.info("Nomenclador - Get");
        nomenclador_service.get(req.query, function(result) {
            
            res.set('Content-type', 'application/json');
            res.status(result.code);
            res.send(result.rs);
        });   
    })
    .post(function(req, res) {
        logger.info("Nomenclador - Post");
        nomenclador_service.post(req.body, function(result) {
            res.send(result);
        });   
    })
    .put(function(req, res){
        logger.info("Nomenclador - Put");
        nomenclador_service.put(req.body, function (result) {
            res.send(result);
    });
});

app.route('/agrupador')
    .get(function(req, res) {
        logger.info("Agrupador - Get");
        agrupadorService.get(req.query, function(result) {
            logger.debug("ejecuto callback");
            
            
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
            res.send(result);
    });   
})
    .post(function(req, res) {
        logger.info("Agrupador - Post");
        agrupadorService.post(req.body, function(result) {
            res.send(result);
        });   
})
    .put(function(req, res){
        logger.info("Agrupador - Put");
        agrupadorService.put(req.body, function(result) {
            res.send(result);
        });
    
});

app.route('/prestacion')
    .get(function(req, res) {
        logger.info("Prestacion - Get");
        prestacion_service.get(req.query, function(result) {
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
        res.send(result);
    });   
})
    .post(function(req, res) {
        logger.info("Prestacion - Post");
        prestacion_service.post(req.body, function(result) {
            res.set('Content-type', 'application/json');
            res.status(result.code);
            res.send(result);
        });   
})
    .put(function(req, res){
        logger.info("Prestacion - Put");
        res.send("NOT IMPLEMENTED YET");
})
    .delete(function(req, res){
        logger.info("Prestacion - Delete");
        res.send("NOT IMPLEMENTED YET");
});

app.route('/prestacion/:id')
    .get(function(req, res) {
        logger.info("Prestacion/:id - Get");
        if(req.query.v=="full") {
            req.params.v="full";
        }
        logger.info("GET con id: "+ req.params.id);
        prestacion_service.get(req.params, function(result) {
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
        res.send(result);
    }); 
});

app.route('/prestacion/:id_prestacion/masterprestacion/:id')
    .get(function(req, res) {
        logger.info("Prestacion/:id_prestacion/masterprestacion/:id - Get");
        masterprestacion_service.get(req.params, function(result) {
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
            res.send(result);
        });
})
    .delete(function(req, res) {
        logger.info("Prestacion/:id_prestacion/masterprestacion/:id - Delete");
        req.params.id_master_prestacion = req.params.id;
        prestacion_service.deleteRelMasterPrestacion(req.params, function(result){
            res.send(result);
        });

});

app.route('/prestacion/:id_prestacion/masterprestacion')
    .get(function(req, res) {
        logger.info("Prestacion/:id_prestacion/masterprestacion - Get");
        logger.info("GET con idprestacion: "+ req.params.id_prestacion);
        masterprestacion_service.get(req.params, function(result) {
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
            res.send(result);
        });
});

app.route('/prestacion/:id/comparacion')
    .get(function(req, res) {
        logger.debug("Busco comparacion Prestacion/:id - Get");

        prestacion_service.comparacion(req.params, function(result) {
            if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
        res.send(result);
    }); 
});


// Master Prestacion
app.get('/masterprestacion', function(req, res) {
    logger.info("masterprestacion - Get");
    masterprestacion_service.get(req.query, function(result) {
        if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                if(result.length != 0) {
                    result = json2csv.parse(result);
                } else {
                    result = "No hay datos para mostrar";
                }
                res.attachment('export.csv');
                
            }
        res.send(result);
    });   
});
app.get('/masterprestacion/:id', function(req, res) {
    logger.info("masterprestacion/:id - Get");
    masterprestacion_service.get(req.params, function(result) {
        
        res.send(result);
    });   
});

app.post('/masterprestacion', function (req, res) {
    logger.info("masterprestacion - Post");
    masterprestacion_service.post(req.body, function(result) {
        logger.info("Ejecuto callback de Post");
        res.status(result.code);
        res.send(result);
        res.end();
    });
});

app.put('/masterprestacion', function (req, res) {
    logger.info("masterprestacion - Put");
    masterprestacion_service.put(req.body, function(result){
        logger.info("Ejecuto callback");
        res.status(result.code);
        res.send(result.result);
    });
});

// relprestacionmasterprestacion

app.post('/relprestacionmasterprestacion', function (req, res) {
    logger.info("relprestacionmasterprestacion - Post");
    error = false
    relPrestacionMasterPrestacionService.post((req.body), function(result) {
        logger.debug("Ejecuto callback");
        logger.debug(result);
        if(result.code != 200 || result.code != 201 || result.code != 204 || result.code != 205 ) {
            error = result;
        }
    });
    if(error) {
        res.status(400);
        res.send(error);
    } else {
        res.status(200);
        res.send("Ok");
    }
});

app.get('/relprestacionmasterprestacion', function(req, res) {
    logger.info("relprestacionmasterprestacion - get");
    relPrestacionMasterPrestacionService.get(req.query, function(result) {
        if(req.query.format === "csv") {
                logger.debug("Convierto a csv");
                result = json2csv.parse(result);
                res.attachment('export.csv');
            }
        res.send(result);
    });
});

app.get('/test', function(req,res) {
//   logger.info("Inicio Test") ;
//   logger.info("Ejecuto test de ID duplicado");
//   testService.testIdDuplicado();
//   logger.info("Ejecuto test de clave compuesta duplicada");
//   testService.testClaveCompuesta();
//   logger.info("Fin test");
    logger.debug("Test");
    testService.testDatabase();
    res.send("");
});

app.post('/auth', function(req, res) {

    logger.debug(req.body);

    
    usr = authenticationService.authenticate(req.body.user, req.body.password, function(usr) {
        if(!usr) {
            res.redirect('login.html?not_authorized');
        }
    });
    

    
    
    res.end();
});

app.get('/login', function(req, res) {
    res.redirect('login.html');
    res.end();
});


app.listen(3001,function(){
    logger.info("Working on port 3001"); 
});
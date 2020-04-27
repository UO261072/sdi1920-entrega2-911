//Modulos
let express=require('express');
let app=express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

//Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@socialnetwork-shard-00-00-mmisd.mongodb.net:27017,socialnetwork-shard-00-01-mmisd.mongodb.net:27017,socialnetwork-shard-00-02-mmisd.mongodb.net:27017/test?ssl=true&replicaSet=socialnetwork-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app,swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rinvitaciones.js")(app,swig, gestorBD); // (app, param1, param2, etc.)


// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})
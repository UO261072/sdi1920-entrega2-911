//Modulos
let express=require('express');
let app=express();

var jwt = require('jsonwebtoken');
app.set('jwt',jwt);

let fs = require('fs');
let https = require('https');

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

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});

//Aplicar routerUsuarioSession
app.use("/invitaciones/lista",routerUsuarioSession);
app.use("/amigos/lista",routerUsuarioSession);
app.use("/usuarios/lista",routerUsuarioSession);
app.use(express.static('public'));

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/invitaciones', routerUsuarioToken);

//Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@socialnetwork-shard-00-00-mmisd.mongodb.net:27017,socialnetwork-shard-00-01-mmisd.mongodb.net:27017,socialnetwork-shard-00-02-mmisd.mongodb.net:27017/test?ssl=true&replicaSet=socialnetwork-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app,swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rinvitaciones.js")(app,swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rapiusuarios.js")(app, gestorBD); // (app, param1, param2, etc.)
require("./routes/rapiinvitaciones.js")(app, gestorBD); // (app, param1, param2, etc.)
require("./routes/rapimensajes.js")(app, gestorBD); // (app, param1, param2, etc.)

app.get('/', function (req, res) {
    res.redirect('/identificarse');
})

// lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});
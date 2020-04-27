module.exports = function(app,swig,gestorBD) {

    app.post('/usuario', function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        if(req.body.password!=req.body.password2){
            res.send("Contraseña diferente");
        }else{
            let criterio={email : req.body.email};
            gestorBD.obtenerUsuarios(criterio, function(usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    let usuario = {
                        email : req.body.email,
                        name: req.body.name,
                        surname:req.body.surname,
                        password : seguro
                    }
                    gestorBD.insertarUsuario(usuario, function(id) {
                        if (id == null){
                            res.send("Error al insertar el usuario");
                        } else {
                            res.send('Usuario Insertado ' + id);
                        }
                    });
                } else {
                    res.send("Email ya existe");
                }
            });

        }

    });
    app.get("/registrarse", function(req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });
    app.get("/identificarse", function(req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });
    app.post("/identificarse", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/registrarse");
            }
        });
    });
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    })

    app.get('/home',function(req,res){
        let respuesta=swig.renderFile('views/bhome.html',{usuario: req.session.usuario})
        res.send(respuesta)
    })
    app.get('/usuarios/lista',function(req,res){

        let criterio={};
        if( req.query.busqueda != null ){
            criterio = { "nombre" :  {$regex : ".*"+req.query.busqueda+".*"} };
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if ( req.query.pg == null){ // Puede no venir el param
            pg = 1;
        }
        gestorBD.obtenerUsuariosPg(criterio, pg , function(usuarios, total ) {
            if (usuarios == null) {
                res.send("Error al listar ");
            } else {
                let ultimaPg = total/4;
                if (total % 4 > 0 ){ // Sobran decimales
                    ultimaPg = ultimaPg+1;
                }
                let paginas = []; // paginas mostrar
                for(let i = pg-2 ; i <= pg+2 ; i++){
                    if ( i > 0 && i <= ultimaPg){
                        paginas.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/bUsuariosLista.html',
                    {
                        usuarios : usuarios,
                        paginas : paginas,
                        actual : pg
                    });
                res.send(respuesta);
            }
        });

        /*let respuesta=swig.renderFile('views/bUsuariosLista',{})
        res.send(respuesta)*/
    })
};

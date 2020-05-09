module.exports = function(app,swig,gestorBD) {
    app.get("/invitaciones", function(req, res) {
        res.send("ver invitaciones");
    });
    app.get('/invitacion/:usuario', function (req, res) {
        if(req.session.usuario!=null) {
            let criterio = {"email": req.params.usuario};
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    res.redirect("/usuarios/lista" +
                        "?mensaje=El usuario no existe" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    let usuarioReceptor = usuarios[0];
                    criterio = {"email": req.session.usuario}
                    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                        if (usuarios == null || usuarios.length == 0) {
                            res.redirect("/usuarios/lista" +
                                "?mensaje=Debes iniciar sesion" +
                                "&tipoMensaje=alert-danger ");
                        } else {
                            let usuarioEmisor = usuarios[0];
                            if (usuarioEmisor.email != usuarioReceptor.email) {
                                let invitacion = {
                                    usuarioEmisor: usuarioEmisor.email,
                                    usuarioReceptor: usuarioReceptor.email,
                                    aceptada: false
                                }
                                criterio={  "usuarioEmisor": usuarioEmisor.email,
                                            "usuarioReceptor": usuarioReceptor.email}
                                gestorBD.obtenerInvitaciones(criterio,function(invitaciones){
                                    if(invitaciones.length!=0)
                                        res.redirect("/usuarios/lista" +
                                            "?mensaje=Ya has mandado una peticion de amistad a este usuario previamente" +
                                            "&tipoMensaje=alert-danger ");
                                    else
                                        gestorBD.añadirInvitacion(invitacion, function (id) {
                                            if (id == null) {
                                                res.redirect("/usuarios/lista" +
                                                    "?mensaje=Error al enviar peticion" +
                                                    "&tipoMensaje=alert-danger ");
                                            } else {
                                                res.send('Invitacion Insertada '+ id);
                                            }
                                        });
                                })


                                //res.send(invitacion)
                            } else
                                res.redirect("/usuarios/lista" +
                                    "?mensaje=No te puedes agregar a amigos a ti mismo" +
                                    "&tipoMensaje=alert-danger ");
                        }
                    })
                }
                /*let respuesta = 'Nombre: ' + req.params.usuario;
                res.send(respuesta);*/
            })
        }
        else
            res.redirect("/identificarse" +
                "?mensaje=Debes iniciar sesion para acceder a esa pagina" +
                "&tipoMensaje=alert-danger ");
    })

    app.get('/invitaciones/lista',function(req,res){

        if(req.session.usuario!=null) {
            let criterio = {"usuarioReceptor": req.session.usuario, "aceptada": false};

            let pg = parseInt(req.query.pg); // Es String !!!
            if (req.query.pg == null) { // Puede no venir el param
                pg = 1;
            }
            gestorBD.obtenerUsuariosDeInvitacionesPropiasPg(criterio,pg,function(usuarios,paginas){
                if(usuarios==null){
                    res.redirect("/identificarse");
                }else if(usuarios.length==0){
                    res.send("No tienes invitaciones")
                }
                else {
                    let respuesta = swig.renderFile('views/bInvitacionLista.html',
                        {
                            usuarios: usuarios,
                            paginas: paginas,
                            actual: pg
                        });
                    res.send(respuesta);
                }
            })
        }else{
            res.redirect("/identificarse");
        }
        /*let respuesta=swig.renderFile('views/bUsuariosLista',{})
        res.send(respuesta)*/
    })

    app.get('/invitacion/:usuario/aceptar',function (req,res) {
        if(req.session.usuario==null){
            res.redirect("/identificarse");
        }else{
            let criterio={"usuarioEmisor":req.params.usuario, "usuarioReceptor" : req.session.usuario}
            let invitacion={"usuarioEmisor":req.params.usuario, "usuarioReceptor" : req.session.usuario, aceptada:true}
            gestorBD.aceptarInvitacion(criterio,invitacion,function (result) {
                if(result==null){
                    res.redirect("/invitaciones/lista")
                }
                else{
                    res.redirect("/invitaciones/lista")
                }
            })
        }

    })

    app.get('/amigos/lista',function (req,res) {
        if(req.session.usuario==null) {
            res.redirect("/identificarse");
        }else {
            let criterio = {"usuarioReceptor": req.session.usuario, "aceptada": true};

            let pg = parseInt(req.query.pg); // Es String !!!
            if (req.query.pg == null) { // Puede no venir el param
                pg = 1;
            }
            gestorBD.obtenerUsuariosDeInvitacionesPropiasPg(criterio, pg, function (usuarios, paginas) {
                if (usuarios == null) {
                    res.redirect("/identificarse");
                } else if (usuarios.length == 0) {
                    res.send("No tienes amigos")
                } else {
                    let respuesta = swig.renderFile('views/bAmigosLista.html',
                        {
                            usuarios: usuarios,
                            paginas: paginas,
                            actual: pg
                        });
                    res.send(respuesta);
                }
            })
        }

    })
};

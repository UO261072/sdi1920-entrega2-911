module.exports = function(app, gestorBD) {

    app.post("/api/mensaje/:usuario",function (req,res) {

        var mensaje={
            emisor : req.session.usuario,
            destino : req.params.usuario,
            texto : req.body.texto,
            leido : false
        }

        gestorBD.insertarMensaje(mensaje,function (id) {
            if(id==null){
                res.status(500);
                res.json({
                    error:"se ha producido un error"
                })
            }else{
                res.status(201);
                res.json({
                    mensaje : "mensaje enviado",
                    _id : id
                })
            }
        })

    })


    app.get("/api/mensaje/conversacion",function (req,res) {
        let criterio
        if(req.body.user!=null)
            criterio={ $or:[{ emisor : req.body.user, destino : req.session.usuario },{ destino : req.body.user, emisor : req.session.usuario }]  }
        else
            criterio={ $or:[{ emisor : req.query.user, destino : req.session.usuario },{ destino : req.query.user, emisor : req.session.usuario }]  }
        gestorBD.obtenerConversacion(criterio,function (mensajes) {
            if(mensajes==null){
                res.status(500)
                res.json({
                    error:"se ha producido un error"
                })
            }else{
                if(req.body.user!=null)
                    criterio={destino : req.session.usuario,emisor : req.body.user}
                else
                    criterio={destino : req.session.usuario,emisor : req.query.user}
                gestorBD.mensajesLeidos(criterio,function (result) {
                    if(result==null){
                        res.status(500)
                        res.json({
                            error:"no se ha marcado comoo leido"
                        })
                    }
                })
                res.status(200);
                res.send( JSON.stringify(mensajes) );
            }
        })
    })

}
module.exports = function(app, gestorBD) {

    app.post("/api/mensaje/nuevo",function (req,res) {

        var mensaje={
            emisor : req.session.usuario,
            destino : req.body.destino,
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

        let criterio={ $or:[{ emisor : req.body.user, destino : req.session.usuario },{ destino : req.body.user, emisor : req.session.usuario }]  }

        gestorBD.obtenerConversacion(criterio,function (mensajes) {
            if(mensajes==null){
                res.status(500)
                res.json({
                    error:"se ha producido un error"
                })
            }else{
                res.status(200);
                res.send( JSON.stringify(mensajes) );
            }
        })
    })

}
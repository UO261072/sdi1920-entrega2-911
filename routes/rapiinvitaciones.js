module.exports = function(app, gestorBD) {


    app.get("/api/invitaciones", function(req, res) {
        gestorBD.obtenerInvitaciones( {} , function(invitaciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(invitaciones) );
            }
        });
    });

    app.get('/api/amigos/lista',function (req,res) {
        let criterio = {$or: [{"usuarioReceptor": req.session.usuario},{"usuarioEmisor": req.session.usuario}], "aceptada": true};
       gestorBD.obtenerUsuariosDeInvitacionesPropias(criterio,req.session.usuario,function (invitaciones) {
            if(invitaciones==null){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            }else{
                let usuarios=[]
                for(let i=0;i<invitaciones.length;i++)
                    usuarios[i]={"email":invitaciones[i].email,"name":invitaciones[i].name,"surname":invitaciones[i].surname}
                res.status(200);
                res.send( JSON.stringify(usuarios) );
            }
       })

    })


}
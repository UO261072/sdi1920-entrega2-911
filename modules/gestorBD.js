module.exports = {
    mongo : null,
    app : null,
    init : function(app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario : function(usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.insert(usuario, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuarios : function(criterio,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                //console.log("Prueba")
                let collection = db.collection('usuarios');
                collection.find(criterio).toArray(function(err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuariosPg : function(criterio,pg,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.count(function(err, count){
                    collection.find(criterio).skip( (pg-1)*4 ).limit( 4 )
                        .toArray(function(err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    añadirInvitacion: function(invitacion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'),function(err,db){
            if(err){
                funcionCallback(null);
            } else{
                let collection =db.collection('invitaciones');
                collection.insert(invitacion, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        })
    },
    obtenerInvitacionesPg : function(criterio,pg,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.count(function(err, count){
                    collection.find(criterio).skip( (pg-1)*4 ).limit( 4 )
                        .toArray(function(err, invitaciones) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(invitaciones, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    obtenerInvitaciones : function(criterio,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                //console.log("Prueba")
                let collection = db.collection('invitaciones');
                collection.find(criterio).toArray(function(err, invitaciones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(invitaciones);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuariosDeInvitacionesPropiasPg: function (criterio,pg,funcionCallBack) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallBack(null);
            } else {
                let collectionInv = db.collection('invitaciones');
                collectionInv.count(function(err, count){
                    collectionInv.find(criterio).skip( (pg-1)*4 ).limit( 4 )
                        .toArray(function(err, invitaciones) {
                            if (err) {
                                funcionCallBack(null);
                            } else {
                                let collectionUs = db.collection('usuarios')
                                criterio={"email": {$regex: invitaciones[0].usuarioEmisor||invitaciones[1].usuarioEmisor||invitaciones[2].usuarioEmisor||invitaciones[3].usuarioEmisor }}
                                collectionUs.find(criterio).toArray(function(err, usuarios) {
                                        if (err) {
                                            funcionCallBack(null);
                                        } else {
                                            funcionCallBack(usuarios,count);
                                        }
                                    })

                            db.close();
                            }
                        });
                });
            }
        });

    }
};
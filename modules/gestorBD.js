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
                                if(invitaciones.length==0){
                                    funcionCallBack(invitaciones);
                                }else {
                                    let usuariosList=[]
                                    for(let i=0;i<invitaciones.length;i++) {
                                        criterio = {"email": invitaciones[i].usuarioEmisor}
                                        collectionUs.find(criterio).toArray(function (err, usuarios) {
                                            if (err) {
                                                funcionCallBack(null);
                                            } else {
                                                usuariosList[i] = usuarios[0]
                                                if(i==invitaciones.length-1)
                                                    funcionCallBack(usuariosList, count);
                                            }
                                        })
                                    }


                                }
                            db.close();
                            }
                        });
                });
            }
        });

    },
    obtenerUsuariosDeInvitacionesPropias: function (criterio,usuario,funcionCallBack) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallBack(null);
            } else {
                let collectionInv = db.collection('invitaciones');
                    collectionInv.find(criterio).toArray(function(err, invitaciones) {
                            if (err) {
                                funcionCallBack(null);
                            } else {
                                let collectionUs = db.collection('usuarios')
                                if(invitaciones.length==0){
                                    funcionCallBack(invitaciones);
                                }else {
                                    let usuariosList=[]
                                    for(let i=0;i<invitaciones.length;i++) {
                                        if(invitaciones[i].usuarioEmisor==usuario)
                                            criterio = {"email": invitaciones[i].usuarioReceptor}
                                        else
                                            criterio = {"email": invitaciones[i].usuarioEmisor}
                                        collectionUs.find(criterio).toArray(function (err, usuarios) {
                                            if (err) {
                                                funcionCallBack(null);
                                            } else {
                                                usuariosList[i] = usuarios[0]
                                                if(i==invitaciones.length-1)
                                                    funcionCallBack(usuariosList);
                                            }
                                        })
                                    }


                                }
                                db.close();
                            }
                        });

            }
        });

    },
    aceptarInvitacion : function(criterio,invitacion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.update(criterio,{$set: invitacion}, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    insertarMensaje :function (mensaje,funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err,db) {
            if(err){
                funcionCallback(null)
            }else{
                let collection =db.collection('mensajes');
                collection.insert(mensaje, function(err, result) {
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
    obtenerConversacion: function (criterio,funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err,db) {
            if(err){
                funcionCallback(null)
            }else{
                let collection =db.collection('mensajes');
                collection.find(criterio).toArray(function(err, mensajes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(mensajes);
                    }
                    db.close();
                });
            }
        })

    },
    mensajesLeidos: function (criterio,funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'),function (err,db) {
            if(err){
                funcionCallback(null)
            }else{
                let collection =db.collection('mensajes');
                collection.find(criterio).toArray(function(err, mensajes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        for(let i=0;i<mensajes.length;i++){
                            mensajes[i].leido=true;
                            collection.update(criterio,{$set: mensajes[i]},function (err,result) {
                                if(err){
                                    funcionCallback(null)
                                }else{
                                    funcionCallback(result)
                                }
                            })
                        }

                    }
                    db.close();
                });
            }
        })

    },

};
module.exports = function(app,swig,gestorBD) {
    app.get("/invitaciones", function(req, res) {
        res.send("ver invitaciones");
    });
};

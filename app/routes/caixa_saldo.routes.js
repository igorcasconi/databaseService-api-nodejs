module.exports = app => {
    const Caixa_Saldo = require('../controllers/caixa_saldo.controller.js');
    var router = require("express").Router();

    router.post("/create-saldo", Caixa_Saldo.create)

    router.get("/saldo/:id", Caixa_Saldo.findAll);

    app.use('/api/caixa_saldo', router);
}
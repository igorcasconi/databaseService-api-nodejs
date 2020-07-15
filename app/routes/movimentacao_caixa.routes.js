module.exports = app => {
    const Movimentacao_Caixa = require('../controllers/movimentacao_caixa.controller.js');
    var router = require("express").Router();

    router.post("/create-mov/:id/:type", Movimentacao_Caixa.create)

    router.get("/movs/:id/:type", Movimentacao_Caixa.findAll);

    app.use('/api/movimentacao_caixa', router);
}
const db = require("../models");
const Movimentacao_Caixa = db.movimentacao_caixa;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.product) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Movimentacao_Caixa
    const mov_caixa = {
      product: req.body.product,
      value: req.body.value,
      paymode: req.body.paymode,
      date: req.body.date,
      time: req.body.time
    };
  
    // Save Movimentacao in the database
    const movimentacao = await sequelize.query('INSERT INTO Movimentacao_Caixa (Movimentacao_Caixa_product,Movimentacao_Caixa_value,Movimentacao_Caixa_date, \
    Movimentacao_Caixa_userFirebase,Movimentacao_Caixa_Tipo_Movimentacao_id,Movimentacao_Caixa_Paymode) VALUES ("' + mov_caixa.product + '",' + mov_caixa.value + ',' +
    'CAST(CONCAT(DATE_FORMAT(STR_TO_DATE("' + mov_caixa.date +'", "%d/%m/%Y"),"%Y-%m-%d"), " ' + mov_caixa.time + '") AS DATETIME),"' + req.params.id + '","' + req.params.type + '","' + mov_caixa.paymode + '");');

    res.send(data);

};

exports.findAll = (req, res) => {
    Caixa_Saldo.findAll({where: {Movimentacao_Caixa_userFirebase: req.params.id, Movimentacao_Caixa_Tipo_Movimentacao_id: req.params.type} })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving."
        });
    });
};


const db = require("../models");
const { sequelize } = require("../models");
const Movimentacao_Caixa = db.movimentacao_caixa;
const Op = db.Sequelize.Op;
const strToDate = require('../../config/strToDate');

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
      date: req.body.date
    };


  
    Movimentacao_Caixa.create({
      Movimentacao_Caixa_product: mov_caixa.product,
      Movimentacao_Caixa_value: mov_caixa.value,
      Movimentacao_Caixa_date: mov_caixa.date,
      Movimentacao_Caixa_userFirebase: req.params.id,
      Movimentacao_Caixa_Tipo_Movimentacao_id: req.params.type,
      Movimentacao_Caixa_Paymode: mov_caixa.paymode
    }).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });


};

exports.findAll = (req, res) => {
    Movimentacao_Caixa.findAll(
      { attributes: ['Movimentacao_Caixa_id', 'Movimentacao_Caixa_product', 'Movimentacao_Caixa_value', 
      [sequelize.fn('date_format', sequelize.col('Movimentacao_Caixa_date'), '%d/%m/%Y'), 'data_formatada'],
      [sequelize.fn('date_format', sequelize.col('Movimentacao_Caixa_date'), '%H:%i'), 'hora_formatada'],
      'Movimentacao_Caixa_Paymode'],
        where: {Movimentacao_Caixa_userFirebase: req.params.id, Movimentacao_Caixa_Tipo_Movimentacao_id: req.params.type} })
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


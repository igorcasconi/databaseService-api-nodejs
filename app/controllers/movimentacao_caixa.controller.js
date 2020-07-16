const db = require("../models");
const { sequelize } = require("../models");
const Movimentacao_Caixa = db.movimentacao_caixa;
const Caixa_Saldo = db.caixa_saldo;
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
      date: req.body.date.concat(' ' + req.body.time)
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

    if ( req.params.type == 1) {
      Caixa_Saldo.find({ where: { Caixa_Saldo_userFirebase: req.parms.id } },
      {
        Caixa_Saldo: Caixa_Saldo_value + mov_caixa.value
      }).then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
      
    } else {
      
    }
};

exports.findAll = (req, res) => {
    Movimentacao_Caixa.findAll(
      { attributes: ['Movimentacao_Caixa_id', 'Movimentacao_Caixa_product', 'Movimentacao_Caixa_value', 
      [sequelize.fn('date_format', sequelize.col('Movimentacao_Caixa_date'), '%d/%m/%Y'), 'data_formatada'],
      [sequelize.fn('date_format', sequelize.col('Movimentacao_Caixa_date'), '%H:%i'), 'hora_formatada'],
      'Movimentacao_Caixa_Paymode'],
        where: {Movimentacao_Caixa_userFirebase: req.params.id, Movimentacao_Caixa_Tipo_Movimentacao_id: req.params.type},
        order: [['Movimentacao_Caixa_date', 'DESC']] })
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

exports.movYear = (req, res) => {
  Movimentacao_Caixa.findAll(
    { attributes: [[sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date')), 'ano'],
    [sequelize.fn('sum', sequelize.literal('CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END')), 'soma'],
    ],
      where: {Movimentacao_Caixa_userFirebase: req.params.id},
      group: [[[sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date'))]]], 
      order: [['Movimentacao_Caixa_date', 'DESC']] })
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


exports.movMonth = (req, res) => {
  Movimentacao_Caixa.findAll(
    { attributes: ['Movimentacao_Caixa_id',[sequelize.fn('monthname', sequelize.col('Movimentacao_Caixa_date')), 'mes'],
    [sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date')), 'ano'],
    [sequelize.fn('sum', sequelize.literal('CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END')), 'soma'],
    ],
      where: {Movimentacao_Caixa_userFirebase: req.params.id},
      group: [[[sequelize.fn('monthname', sequelize.col('Movimentacao_Caixa_date'))],[sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date'))]]],
      order: [['Movimentacao_Caixa_date', 'DESC']] })
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

exports.movDetailYear = (req, res) => {
  Movimentacao_Caixa.findAll(
    { attributes: [[sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date')), 'data'],
    [sequelize.fn('sum', sequelize.literal('CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN Movimentacao_Caixa_value ELSE 0 END')), 'soma'],
    [sequelize.fn('sum',sequelize.literal('CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 1 THEN 1 ELSE 0 END')), 'entrada'],
    [sequelize.fn('sum',sequelize.literal('CASE WHEN Movimentacao_Caixa_Tipo_Movimentacao_id = 2 THEN 1 ELSE 0 END')), 'saida'],
    ],
      where: { [Op.and]: [ sequelize.where(sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date')), req.params.year), {Movimentacao_Caixa_userFirebase: req.params.id} ] },
      group: [[sequelize.fn('year', sequelize.col('Movimentacao_Caixa_date'))]]})
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
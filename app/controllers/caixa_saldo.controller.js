const db = require("../models");
const Caixa_Saldo = db.caixa_saldo;
const { sequelize } = require("../models");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.userFirebase) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Save Tutorial in the database
    Caixa_Saldo.create({Caixa_Saldo_userFirebase: req.body.userFirebase})
      .then(data => {
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
    Caixa_Saldo.findOne({where: {Caixa_Saldo_userFirebase: req.params.id} })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

exports.update = (req, res) => {

  // Validate request
  if (!req.params.id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }


  if (req.params.type == 1 ) {
    Caixa_Saldo.update(
      { Caixa_Saldo_value: sequelize.literal('Caixa_Saldo_value + ' + req.body.valor ) },
      { where: { Caixa_Saldo_userFirebase: req.params.id } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  } else {
    Caixa_Saldo.update(
      { Caixa_Saldo_value: sequelize.literal('Caixa_Saldo_value - ' + req.body.valor ) },
      { where: { Caixa_Saldo_userFirebase: req.params.id } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  }

}

exports.updateSlideInitial = (req, res) => {
  Caixa_Saldo.update(
    { Caixa_Saldo_slideInitial: 1 },
    { where: { Caixa_Saldo_userFirebase: req.params.id } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
  });
}


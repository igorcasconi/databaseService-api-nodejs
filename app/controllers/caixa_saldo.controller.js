const db = require("../models");
const Caixa_Saldo = db.caixa_saldo;
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
    Caixa_Saldo.findAll({where: {Caixa_Saldo_userFirebase: req.params.id} })
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
  
  const mov_caixa = {
    value: req.body.value
  };

  // Validate request
  if (!mov_caixa.value) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const mov_caixa = {
    value: req.body.value
  };
    
  Caixa_Saldo.update({ where: { Caixa_Saldo_userFirebase: req.parms.id } },
    { Caixa_Saldo_value: Caixa_Saldo_value + mov_caixa.value }).then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });

}


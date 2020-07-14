const express = require('express');
const cors = require('cors');
const app = express();         
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3000;//porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/api',router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!',port);

var pool = mysql.createPool({
    host     : 'mysql669.umbler.com',
    port     : 41890,
    user     : 'casconi_lc',
    password : '46Oliveira',
    database : 'livrocaixa_db',
    timeout  : 6000
});

router.get('/caixa_saldo/:id?', cors(), (req, res) =>{
  let filter = '';
  if(req.params.id) filter = ' WHERE Caixa_Saldo_userFirebase="' + req.params.id + '"';
  pool.query('SELECT * FROM Caixa_Saldo' + filter, (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });
})

router.get('/insert-caixa/:id', (req, res) => {
  pool.query('INSERT IGNORE INTO Caixa_Saldo (Caixa_Saldo_userFirebase) VALUES ("' + req.params.id + '")', (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });
})

router.post('/insert-mov/:id/:type', (req, res) =>{
  const product = req.body.product;
  const value = req.body.value;
  const date = req.body.date;
  const time = req.body.time;
  const paymode = req.body.paymode;
  
  pool.query('INSERT INTO Movimentacao_Caixa (Movimentacao_Caixa_product,Movimentacao_Caixa_value,Movimentacao_Caixa_date, \
  Movimentacao_Caixa_userFirebase,Movimentacao_Caixa_Tipo_Movimentacao_id,Movimentacao_Caixa_Paymode) VALUES ("' + product + '",' + value + ',' +
  'CAST(CONCAT(DATE_FORMAT(STR_TO_DATE("' + date +'", "%d/%m/%Y"),"%Y-%m-%d"), " ' + time + '") AS DATETIME),"' + req.params.id + '","' + req.params.type + '","' + paymode + '");', (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });
  
  if( req.params.type == 1) {
    pool.query('UPDATE Caixa_Saldo SET Caixa_Saldo_value = Caixa_Saldo_value + ' + value + ' WHERE Caixa_Saldo_userFirebase = "' + req.params.id + '";', (err, results) => {
      if(err) res.sendStatus(500).send(err);
      else res.send(results);
    });
  } else {
    pool.query('UPDATE Caixa_Saldo SET Caixa_Saldo_value = Caixa_Saldo_value - ' + value + ' WHERE Caixa_Saldo_userFirebase = "' + req.params.id + '";', (err, results) => {
      if(err) res.sendStatus(500).send(err);
      else res.send(results);
    });
  }
})

router.get('/delete-mov/:id/:idmov/:type/:value', (req, res) => {
  pool.query('DELETE FROM Movimentacao_Caixa WHERE Movimentacao_Caixa_id = ' + req.params.idmov, (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });

  if(req.params.type == 1) {
    pool.query('UPDATE Caixa_Saldo SET Caixa_Saldo_value = Caixa_Saldo_value - ' + req.params.value + ' WHERE Caixa_Saldo_userFirebase = "' + req.params.id + '";', (err, results) => {
      if(err) res.sendStatus(500).send(err);
      else res.send(results);
    });

  } else {
    pool.query('UPDATE Caixa_Saldo SET Caixa_Saldo_value = Caixa_Saldo_value + ' + req.params.value + ' WHERE Caixa_Saldo_userFirebase = "' + req.params.id + '";', (err, results) => {
      if(err) res.sendStatus(500).send(err);
      else res.send(results);
    });
  }
})

router.get('/movs/:id/:type', cors(), (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE Movimentacao_Caixa_userFirebase="' + req.params.id + '" AND Movimentacao_Caixa_Tipo_Movimentacao_id = ' + req.params.type;
    pool.query('SELECT *, DATE_FORMAT(Movimentacao_Caixa_date, "%d/%m/%Y") as data_formatada, DATE_FORMAT(Movimentacao_Caixa_date, "%H:%i") as hora_formatada \
     FROM Movimentacao_Caixa' + filter + ' ORDER BY Movimentacao_Caixa_date DESC', (err, results) => {
      if(err) res.sendStatus(500).send(err);
      else res.send(results);
    });
})

router.get('/movs-year/:id', cors(), (req, res) =>{
  let filter = '';
  if(req.params.id) filter = ' WHERE a.Movimentacao_Caixa_userFirebase="' + req.params.id + '"';
  pool.query('SELECT YEAR(a.Movimentacao_Caixa_date) AS "mes", SUM(a.Movimentacao_Caixa_value) AS "soma" FROM Movimentacao_Caixa AS a ' + filter + ' GROUP BY YEAR(Movimentacao_Caixa_date) \
  ORDER BY YEAR(Movimentacao_Caixa_date) DESC', (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });
})

router.get('/movs-month/:id', cors(), (req, res) =>{
  let filter = '';
  if(req.params.id) filter = ' WHERE a.Movimentacao_Caixa_userFirebase="' + req.params.id + '"';
  pool.query('SELECT a.Movimentacao_Caixa_id, MONTHNAME(a.Movimentacao_Caixa_date) AS "mes",YEAR(a.Movimentacao_Caixa_date) AS "ano", SUM(a.Movimentacao_Caixa_value) AS "soma" \
  FROM Movimentacao_Caixa AS a ' + filter + ' GROUP BY MONTHNAME(a.Movimentacao_Caixa_date), YEAR(Movimentacao_Caixa_date) ORDER BY a.Movimentacao_Caixa_date DESC', (err, results) => {
    if(err) res.sendStatus(500).send(err);
    else res.send(results);
  });
})


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

function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'mysql669.umbler.com',
    port     : 41890,
    user     : 'casconi_lc',
    password : '46Oliveira',
    database : 'livrocaixa_db',
    timeout  : 60000
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}

router.get('/caixa_saldo/:id?', (req, res) =>{
  let filter = '';
  if(req.params.id) filter = ' WHERE Caixa_Saldo_userFirebase="' + req.params.id + '"';
  execSQLQuery('SELECT * FROM Caixa_Saldo' + filter, res);
})

router.get('/insert-caixa/:id', (req, res) => {
  execSQLQuery('INSERT IGNORE INTO Caixa_Saldo (Caixa_Saldo_userFirebase) VALUES ("' + req.params.id + '")', res);
})

router.post('/insert-mov/:id/:type', (req, res) =>{
  const product = req.body.product;
  const value = req.body.value;
  const date = req.body.date;
  const time = req.body.time;
  const paymode = req.body.paymode;
  // console.log(window.location.pathname);
  execSQLQuery('INSERT INTO Movimentacao_Caixa (Movimentacao_Caixa_product,Movimentacao_Caixa_value,Movimentacao_Caixa_date, \
  Movimentacao_Caixa_userFirebase,Movimentacao_Caixa_Tipo_Movimentacao_id,Movimentacao_Caixa_Paymode) VALUES ("' + product + '",' + value + ',' +
  'CAST(CONCAT(DATE_FORMAT(' + date +',"%Y-%m-%d"), "' + time + '") AS DATETIME),"' + req.params.id + '","' + req.params.type + '","' + paymode + '");', res);
})

router.get('/caixas/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE Caixa_id=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Caixa' + filter, res);
})
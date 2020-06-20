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
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use('/api',router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!',port);

function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : '185.201.10.94',
    port     : 3306,
    user     : 'u390586897_casconi',
    password : 'casconi12',
    database : 'u390586897_livrocaixa_db',
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

router.get('/caixas', (req, res) =>{
    execSQLQuery('SELECT * FROM Caixa', res);
})

router.get('/caixas/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE Caixa_id=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Caixa' + filter, res);
})
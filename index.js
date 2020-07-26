const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./app/models');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./app/routes/caixa_saldo.routes")(app);
require("./app/routes/movimentacao_caixa.routes")(app);
require("./app/routes/usuario_caixa.routes")(app);

app.listen(3000);
console.log('API funcionando!',3000);


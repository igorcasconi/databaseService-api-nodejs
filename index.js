const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Caixa_Saldo } = require('./app/models');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(express.urlencoded({ extended: false }));

app.post('/register', async (req, res) => {
    const userFirebase = req.body.userFirebase;
    const caixa = await Caixa_Saldo.create({Caixa_Saldo_userFirebase: userFirebase});
    res.json(caixa);
});

app.get('/saldo/:userFirebase', (req, res) => {
    const saldo = Caixa_Saldo.findAll({
        where: { Caixa_Saldo_userFirebase: req.params.userFirebase }
    });
    res.json(saldo);
});

app.get('/saldo/', (req, res) => {
    const saldo = Caixa_Saldo.findAll();
    res.json(saldo);
});

app.listen(3000);


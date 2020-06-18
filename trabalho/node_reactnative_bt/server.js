const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

var minimum = 1;
var maximum = 20;
var sortimum = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertObjToNum(obj) {
    var a = JSON.stringify(obj.post);
    var b = JSON.parse(a);
    var c = parseInt(b);
    return c;
}

app.get('/api/mensagem', (req, res) => {
  res.send({ express: 'And a hello from express RESTful API!' });
});

app.get('/api/sort', (req, res) => {//DESCOMENTAR ABAIXO...
    sortimum = getRandomIntInclusive(minimum, maximum);
    console.log(sortimum);
    res.send(
        { express: `Number: ${sortimum}` }
    );
});

app.post('/api/num1', (req, res) => {
    minimum = convertObjToNum(req.body);
    console.log(typeof minimum);
    console.log(minimum);
    res.send(
        `I received your POST request. This is what you sent me: ${minimum}`,
    );
});

app.post('/api/num2', (req, res) => {
    maximum = convertObjToNum(req.body);
    console.log(typeof maximum);
    console.log(maximum);
    res.send(
        `I received your POST request. This is what you sent me: ${maximum}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
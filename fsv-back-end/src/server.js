import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const dataFile = './data.json';
const fs = require('fs');

app.use(bodyParser.json());

var transactionData = require(dataFile);
app.get('/api/transactions', (req, res) => {
    var displayData = {};
    var displayIds = [];
    displayIds =  Object.keys(transactionData).slice(-5);
    for(var k in displayIds) {
        displayData[displayIds[k]] = transactionData[displayIds[k]];
    }
    res.status(200).json(displayData);
});

app.get('/api/transaction/:id', (req, res) => {
    if(transactionData[req.params.id]) {
        res.status(200).json(transactionData[req.params.id]);
    } else {
        res.status(404).json('Could not find the transactions.');
    }
});

app.post('/api/transaction/edit/:id', async (req, res) => {
    var updateKey = 0;
    if(req.params.id && parseInt(req.params.id) > 0) {
        if(!transactionData[req.params.id]) {
            res.status(404).json('Could not find the transactions.');
        }
        updateKey = req.params.id;
    }

    if(!req.params.id || parseInt(req.params.id) === 0) {
        // Add to database.
        updateKey = parseInt(Object.keys(transactionData).slice(-1)[0]) + 1;
    }

    transactionData[updateKey] = req.body;

    await fs.writeFile('./src/data.json', JSON.stringify(transactionData), function (err) {
        if(err) {
            res.status(500).json(err);
            console.log(err);
        } else {
            res.status(200).json('Transaction Saved');
        }
    });
});

app.listen(8000, () => {
    console.log('Connected, port 8000');
});
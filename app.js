'use strict';

const express = require('express');
const AirConditioner = require('./AirConditioner');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
    res.send('Welcome to your home universal remote controller.');
});

app.get('/on', (req, res) => {
    const ac = new AirConditioner('on', req.query);

    if (req.query.mode === 'heat') {
        return ac.set().then(data => res.json(data));
    }

    ac.turnOn().then(data => res.json(data));
});

app.get('/off', (req, res) => {
    const ac = new AirConditioner('off', req.query);
    ac.turnOff().then(data => res.json(data));
});

app.get('/set', (req, res) => {
    const ac = new AirConditioner('on', req.query);
    ac.set().then(data => res.json(data));
});

app.get('/status', (req, res) => {
    res.json(AirConditioner.getState());
});

app.listen(3001, () => {
    console.log('Universal remote server listening on port 3001!');
});

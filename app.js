'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const AirConditioner = require('./AirConditioner');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

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

// homebridge api -- TODO: move this

let currentState = false;

app.get('/homebridge/status', (req, res) => {
    console.log('GET /homebridge/status - currentState: ', currentState)

    res.status(200).json({
        currentState: currentState
    });
});

app.post('/homebridge/set', (req, res) => {
    currentState = req.body.targetState || false;

    console.log('POST /homebridge/set - currentState: ', currentState)

    res.status(200).json({
        currentState: currentState
    });
});

app.listen(3001, () => {
    console.log('Universal remote server listening on port 3001!');
});

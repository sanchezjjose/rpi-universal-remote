'use strict';

const express = require('express');
const helper = require('./helper');
const AirConditioner = require('./AirConditioner');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to your home universal remote controller.');
});

app.get('/status', (req, res) => {
    res.json(helper.getCurrentSettings());
});

app.get('/off', (req, res) => {
    const airConditioner = new AirConditioner('off', req.query);

    airConditioner.turnOff(data => {
        res.json(data);
    });
});

app.get('/on', (req, res) => {
    const airConditioner = new AirConditioner('on', req.query);

    if (req.query.mode === 'heat') {
        airConditioner.sendCommand(data => {
            res.json(data);
        });

    } else {
        airConditioner.turnOn(data => {
            setTimeout(() => {
                airConditioner.sendCommand(data => {
                    res.json(data);
                });
            }, 2000);
        });
    }
});

app.get('/set', (req, res) => {
    const airConditioner = new AirConditioner('on', req.query);

    airConditioner.sendCommand(data => {
        res.json(data);
    });
});

app.listen(3000, () => {
    console.log('Universal remote application listening on port 3000!');
});

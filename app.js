const express = require('express');
const lircNode = require('lirc_node');

const app = express();
const AC_UNIT_NAME = 'fujitsu_heat_ac';

let currentSettings = {};

lirc_node = require('lirc_node');
lirc_node.init();


// ========== TODO: MOVE TO API ============== \\
function turnOn (mode, callback) {
    lirc_node.irsend.send_once(AC_UNIT_NAME, `${mode}-on`, callback);
}

function turnOff (callback) {
    lirc_node.irsend.send_once(AC_UNIT_NAME, 'turn-off', callback);
}

function sendCommand (settings, callback) {
    const mode  = settings.mode  || 'dry';
    const speed = settings.speed || 'auto';
    const temp  = settings.temp  || '72';

    const command = `${mode}-${speed}-${temp}F`;
    console.log(`Sending command: ${command}`);
    
    lirc_node.irsend.send_once(AC_UNIT_NAME, command, callback);
};
// ========== TODO: MOVE TO API ============== \\

function getResponseJSON (state, settings) {
    currentSettings = {
        isOn:  state === 'on',
        isOff: state === 'off',
        settings: {
            mode: settings.mode,
            speed: settings.speed,
            temp: settings.temp
        }
    };

    return currentSettings;
};

app.get('/', (req, res) => {
    res.send('Welcome to your home universal remote controller.');
});

app.get('/status', (req, res) => {
    res.send(currentSettings);
});

app.get('/off', (req, res) => {
    const settings = req.query;

    turnOff(() => {
        res.json(getResponseJSON('off', settings));
    });
});

app.get('/on', (req, res) => {
    const settings = req.query;

    if (req.query.mode === 'heat') {
        sendCommand(settings, () => {
            res.json(getResponseJSON('on', settings));
        });

    } else {
        turnOn(settings.mode, () => {
            setTimeout(() => {
                sendCommand(settings, () => {
                    res.json(getResponseJSON('on', settings));
                });
            }, 2000);
        });
    }
});

app.get('/set', (req, res) => {
    const settings = req.query;

    sendCommand(settings, () => {
        res.json(getResponseJSON('on', settings));
    });
});

app.listen(3000, () => {
    console.log('Universal remote application listening on port 3000!');
});

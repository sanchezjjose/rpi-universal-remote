const express = require('express');
const lircNode = require('lirc_node');
const app = express();

let currentStatus = 'Unknown';

lirc_node = require('lirc_node');
lirc_node.init();

function sendCommand (command, callback) {
    console.log(`Sending command ${command}`);
    lirc_node.irsend.send_once('fujitsu_heat_ac', command, callback);
};

app.get('/', (req, res) => {
    res.send('Welcome to your home universal remote controller.');
});

app.get('/status', (req, res) => {
    console.log('Sending current status.');
    res.send(currentStatus);
});

// TODO: split into 2 routes -- /alexa/api/v1/on and /on
app.get('/on', (req, res) => {
    console.log('Sending power on command: ', req.query);

    const mode = req.query.mode || 'dry'; // cool, heat, dry, fan
    const fanSpeed = req.query.speed || 'auto'; // auto, high, medium, low, quiet
    const temp = req.query.temp || '72';   // [68...88] in increments of '2'  
    const command = `${mode}-${fanSpeed}-${temp}F`;

    currentStatus = `${mode} mode on ${fanSpeed}, at ${temp} degrees.`;
    const output = `Turned on ${currentStatus}.`;
    
    console.log('output: ', output);

    if (mode === 'heat') {
        sendCommand(command, function() {
            res.send(output);
        });

    } else {
        console.log('Turning unit on.');

        sendCommand(`${mode}-on`, function() {
            setTimeout(() => {
                sendCommand(command, function() {
                    res.send(output);
                });
            }, 2000);
        });
    }
});

// TODO: split into 2 routes -- /alexa/api/v1/set and /set
app.get('/set', (req, res) => {
    console.log('Changing settings: ', req.query);

    const mode = req.query.mode || 'dry'; // cool, heat, dry, fan
    const fanSpeed = req.query.speed || 'auto'; // auto, high, medium, low, quiet
    const temp = req.query.temp || '72';   // 68, 70, 72...
    const command = `${mode}-${fanSpeed}-${temp}F`;

    currentStatus = `${mode} mode on ${fanSpeed}, at ${temp} degrees.`;
    const output = `Set on ${currentStatus}.`;
    
    console.log('output: ', output);

    sendCommand(command, function() {
        res.send(output);
    });
});

// TODO: split into 2 routes -- /alexa/api/v1/off and /off
app.get('/off', (req, res) => {
    console.log('Sending power off command.');

    currentStatus = 'Off';
    
    sendCommand('turn-off', function() {
        res.send('The AC is now off.');
    });
});

app.listen(3000, () => {
    console.log('Alfred app listening on port 3000!');
});

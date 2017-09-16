const express = require('express');
const lircNode = require('lirc_node');
const app = express();

lirc_node = require('lirc_node');
lirc_node.init();

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);

function sendCommand (command, callback) {
    console.log(`Sending command ${command}`);
    lirc_node.irsend.send_once('fujitsu_heat_ac', command, callback);
};

app.get('/', function (req, res) {
    console.log(req.query);
    res.send('Welcome to your home universal remote controller.');
});

app.get('/on', function (req, res) {
    console.log(req.query);

    const mode = req.query.mode || 'dry'; // cool, heat, dry, fan
    const fanSpeed = req.query.speed || 'auto'; // auto, high, medium, low, quiet
    const temp = req.query.temp || '72';   // 68, 70, 72...
    const command = `${mode}-${fanSpeed}-${temp}`;
    const output = `Turned on unit on ${mode}, ${fanSpeed}, at ${temp} degrees.`;

    if (mode === 'heat') {
        sendCommand(command, function() {
            console.log(output);
            res.send(output);
        });

    } else {
        sendCommand(`${mode}-on`, function() {
            console.log('Turned unit on.');

            setTimeout(() => {
                sendCommand(command, function() {
                    console.log(output);
                    res.send(output);
                });
            }, 2000);
        });
    }
});

app.get('/set', function (req, res) {
    console.log(req.query);

    const mode = req.query.mode || 'dry'; // cool, heat, dry, fan
    const fanSpeed = req.query.speed || 'auto'; // auto, high, medium, low, quiet
    const temp = req.query.temp || '72';   // 68, 70, 72...
    const command = `${mode}-${fanSpeed}-${temp}`;
    const output = `Set unit to ${mode}, ${fanSpeed}, at ${temp} degrees.`;

    sendCommand(command, function() {
        console.log(output);
        res.send(output);
    });
});

app.get('/off', function (req, res) {
    sendCommand('turn-off', function() {
        console.log('Sent AC power off command.');
        res.send('Your unit is OFF!');
    });
});

app.listen(3000, function () {
    console.log('Alfred app listening on port 3000!');
});

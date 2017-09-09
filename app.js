const express = require('express')
const lircNode = require('lirc_node')
const app = express()

lirc_node = require('lirc_node');
lirc_node.init();

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);

app.get('/', function (req, res) {
    res.send('Welcome to your home universal remote controller')
})

app.get('/on', function (req, res) {

    lirc_node.irsend.send_once("fujitsu_heat_ac", "cool-on", function() {
      console.log("Sent AC cool power command.");
    });

    res.send('AC is ON!')
})

app.get('/off', function (req, res) {

    lirc_node.irsend.send_once("fujitsu_heat_ac", "turn-off", function() {
      console.log("Sent AC power off command.");
    });

    res.send('AC is OFF!')
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

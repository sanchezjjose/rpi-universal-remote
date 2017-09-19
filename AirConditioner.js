'use strict';

const lirc_node = require('lirc_node');
const helper = require('./helper');
const AC_UNIT_NAME = 'fujitsu_heat_ac';

lirc_node.init();

class AirConditioner {

    constructor (state, settings) {
        this.state = state;
        this.mode =  settings.mode  || 'dry';
        this.speed = settings.speed || 'auto';
        this.temp =  settings.temp  || '72';
    }

    turnOn (callback) {
        const data = helper.getResponseJSON(this);
        lirc_node.irsend.send_once(AC_UNIT_NAME, `${this.mode}-on`, callback(data));
    }

    turnOff (callback) {
        const data = helper.getResponseJSON(this);
        lirc_node.irsend.send_once(AC_UNIT_NAME, 'turn-off', callback(data));
    }

    sendCommand (callback) {
        const data = helper.getResponseJSON(this);
        const command = `${this.mode}-${this.speed}-${this.temp}F`;
        console.log(`Sending command: ${command}`);

        lirc_node.irsend.send_once(AC_UNIT_NAME, command, callback(data));
    };
};

module.exports = AirConditioner;

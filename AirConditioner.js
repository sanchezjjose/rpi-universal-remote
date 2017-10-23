'use strict';

const lirc_node = require('lirc_node');
const helper = require('./helper');
const AC_UNIT_NAME = 'fujitsu_heat_ac';

lirc_node.init();

class AirConditioner {

    constructor (state, settings) {
        this.state = state;
        this.mode = settings.mode;
        this.speed = settings.speed;
        this.temp = settings.temp;

        this.sleep = this.sleep.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
        this.set = this.set.bind(this);
    }

    async turnOn () {
        await this.sendCommand(`${this.mode}-on`);
        await this.sleep(2000);

        return await this.set();
    }

    async turnOff () {
        return await this.sendCommand('turn-off');
    }

    async set () {
        return await this.sendCommand(`${this.mode}-${this.speed}-${this.temp}F`);
    }

    sendCommand (cmd) {
        console.log(`Sending command: ${cmd}`);
        
        return new Promise(resolve => {
            lirc_node.irsend.send_once(AC_UNIT_NAME, cmd, () => {
                const data = helper.getResponseJSON(this);
                resolve(data);
            });
        });
    }

    sleep (ms = 0) {
        return new Promise (resolve => setTimeout(resolve, ms));
    }
};

module.exports = AirConditioner;

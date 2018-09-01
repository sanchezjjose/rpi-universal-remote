'use strict';

const lirc_node = require('lirc_node');
const AC_UNIT_NAME = 'fujitsu_heat_ac';

lirc_node.init();

// init and store latest AirConditioner instance in memory
let ac = { 
    state : 'off', 
    mode  : 'dry', 
    speed : 'auto', 
    temp  : '70' 
};

class AirConditioner {

    constructor (state, settings) {
        this.state = state;
        this.mode  = settings.mode  || ac.mode;
        this.speed = settings.speed || ac.speed;
        this.temp  = settings.temp  || ac.temp;

        this.sleep = this.sleep.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
        this.set = this.set.bind(this);

        ac = this;
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
            lirc_node.irsend.send_once(AC_UNIT_NAME, cmd, () => resolve(AirConditioner.getState()));
        });
    }

    sleep (ms = 0) {
        return new Promise (resolve => setTimeout(resolve, ms));
    }

    static getState () {
        const settings = { mode:  ac.mode, speed: ac.speed, temp:  ac.temp };

        return {
            isOn:  ac.state === 'on',
            isOff: ac.state === 'off',
            settings: settings
        };
    }
};

module.exports = AirConditioner;

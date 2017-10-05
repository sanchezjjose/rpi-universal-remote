'use strict';

let currentSettings = {};

function getCurrentSettings () {
    return currentSettings;
};

function getResponseJSON (airConditioner) {

    currentSettings = {
        isOn:  airConditioner.state === 'on',
        isOff: airConditioner.state === 'off',
        settings: {
            mode:  airConditioner.mode,
            speed: airConditioner.speed,
            temp:  airConditioner.temp
        }
    };

    return currentSettings;
};

module.exports = {

    getCurrentSettings: getCurrentSettings,

    getResponseJSON: getResponseJSON
};

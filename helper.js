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
            mode:  airConditioner.mode  || 'dry',
            speed: airConditioner.speed || 'auto',
            temp:  airConditioner.temp  || '72'
        }
    };

    return currentSettings;
};

module.exports = {

    getCurrentSettings: getCurrentSettings,

    getResponseJSON: getResponseJSON
};

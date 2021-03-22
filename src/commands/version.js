'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'version',
    syntax: [
        '-v',
        '--version'
    ],
    helpText: `Print out ${pjson.name} version`,
    handler: handler
};

tcommands.register(command);

async function handler () {
    console.log(`${pjson.name} version ${pjson.version}`);
}

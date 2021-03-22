'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'refreshData',
    syntax: [
        '-r',
        '--refresh'
    ],
    helpText: 'Refresh data'
}

tcommands.register(command);

'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'detail',
    syntax: [
        '-d',
        '--detail'
    ],
    helpText: `Print further details`
};

tcommands.register(command);


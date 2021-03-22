'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'help',
    syntax: [
        '-h',
        '--help'
    ],
    helpText: 'Shows this help text',
    handler: handler,
}

tcommands.register(command);

async function handler () {
    console.log(`Usage: ${pjson.name} [command] [params]\n`);
    console.log(`Commands:\n`);

    Object.keys(tcommands.commands).forEach(command => {
        let x = tcommands.commands[command];
        console.log(tcommands.commands[command].syntax.join(', ').padEnd(40) + tcommands.commands[command].helpText);
    })
    let x = tcommands;
}

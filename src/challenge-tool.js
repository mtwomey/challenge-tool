#!/usr/bin/env node
'use strict';

const tcommands = require('tcommands');

tcommands.loadCommands(`${__dirname}/commands`);
tcommands.processCommands({defaultCommand: 'help'});

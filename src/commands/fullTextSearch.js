'use strict';

const tcommands = require('tcommands');
const challengeData = require ('../../lib/challengeData');

const command = {
    name: 'fullTextSearch',
    syntax: [
        '-fts',
        '--full-text-search'
    ],
    helpText: 'Search ALL data returned from v5/challenges (active challenges) return matching (case insensitive)',
    handler: handler
};

tcommands.register(command);

async function handler() {
    if (tcommands.getArgValue('fullTextSearch') === true) {
        console.log('Error: Must provide search term');
        process.exit(1);
    }
    if (tcommands.getArgValue('refreshData')) {
        console.log(`*** Refreshing challenge data ***`);
        challengeData.refresh();
    }

    let data = await challengeData.get();
    console.log(`*** ${data.challenges.length} challenges, data from ${data.date} ***`);

    const matchingChallenges = data.challenges.filter(challenge => {
        return JSON.stringify(challenge).toLowerCase().includes(tcommands.getArgValue('fullTextSearch').toLowerCase());
    });
    console.log(`*** ${matchingChallenges.length} Result${matchingChallenges.length !== 1 ? 's' : ''} ***`);
    matchingChallenges.forEach(challenge => {
        console.log(`${challenge.name} [https://www.topcoder.com/challenges/${challenge.id}]`);
        if (tcommands.getArgValue('detail')) {
            console.log(JSON.stringify(challenge, null, 2));
        }
    })
}

'use strict';

const tcommands = require('tcommands');
const auth = require('../../lib/auth');
const axios = require('axios');
const fs = require('fs');

const TEMP_CHALLENGE_DATA = '/tmp/.challenge_data';
const PER_PAGE = 50;

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
        if (fs.existsSync(TEMP_CHALLENGE_DATA))
            fs.unlinkSync(TEMP_CHALLENGE_DATA);
    }

    let challengeData;

    if (fs.existsSync(TEMP_CHALLENGE_DATA)) {
        challengeData = JSON.parse(fs.readFileSync(TEMP_CHALLENGE_DATA, 'utf8'));
        console.log(`*** Using challenge data from ${challengeData.date} ***`);
        console.log(`*** ${challengeData.challenges.length} challenges ***`);
    } else {
        console.log(`*** Refreshing challenge data ***`);
        challengeData = {};
        challengeData.date = new Date().toString();
        const jwt = await auth.getJWT();

        const params = {
            status: 'Active',
            perPage: PER_PAGE
        };

        const url = `https://api.topcoder.com/v5/challenges?${Object.entries(params).map(param => {
            return `${param[0]}=${param[1]}`;
        }).join('&')}`;

        challengeData.challenges = [];

        axios.interceptors.request.use(config => {
            config.headers = {
                authorization: `Bearer ${jwt.token}`
            }
            return config;
        });

        // Get the first page
        const firstPageResponse = await axios.get(url);
        challengeData.challenges.push(...firstPageResponse.data);

        // Get the rest of the pages simultaneously
        const totalPages = parseInt(firstPageResponse.headers['x-total-pages']);
        await Promise.all([...Array(totalPages - 1).keys()].map(i => {
            return axios.get(`${url}&page=${i + 2}`).then(result => {
                challengeData.challenges.push(...result.data);
            });
        }));
        fs.writeFileSync(TEMP_CHALLENGE_DATA, JSON.stringify(challengeData, null, 2));
        console.log(`*** Retrieved ${challengeData.challenges.length} challenges ***`);
    }

    const matchingChallenges = challengeData.challenges.filter(challenge => {
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

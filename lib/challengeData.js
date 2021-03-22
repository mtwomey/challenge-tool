'use strict';

const fs = require('fs');
const auth = require('./auth');
const axios = require('axios');

const TEMP_CHALLENGE_DATA = '/tmp/.challenge_data';
const PER_PAGE = 50;

let challengeData;

function refresh() {
    if (fs.existsSync(TEMP_CHALLENGE_DATA))
        fs.unlinkSync(TEMP_CHALLENGE_DATA);
}

async function get() {
    if (fs.existsSync(TEMP_CHALLENGE_DATA)) {
        challengeData = JSON.parse(fs.readFileSync(TEMP_CHALLENGE_DATA, 'utf8'));
        return challengeData;
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
        return challengeData;
    }
}

module.exports = {
    get,
    refresh
}

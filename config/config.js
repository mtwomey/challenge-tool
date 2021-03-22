'use strict';

const auth = {};
auth.baseUrl = 'https://auth.topcoder.com';
auth.endpointAuthorize = `${auth.baseUrl}/authorize`;
auth.clientId='UW7BhsnmAQh0itl56g1jUPisBO9GoowD'
auth.redirectUri = 'https://auth-redirect.topcoder.com';
auth.audience = 'https://api.topcoder.com/';

module.exports = {
    auth
}


# Install
    npm i -g mtwomey/challenge-tool
or

    npm i -g mtwomey/challenge-tool#[version tag]
# Help
```
Usage: challenge-tool [command] [params]

Commands:

-d, --detail                            Print further details
-fts, --full-text-search                Search ALL data returned from v5/challenges (active challenges) return matching (case insensitive)
-h, --help                              Shows this help text
-r, --refresh                           Refresh data
-v, --version                           Print out challenge-tool version
```
# Notes
**Important Note:** This tools stores the challenge data it pulls down in `/tmp/.challenge_data` and it stores your JWT token in `tmp/.tc_access_token`.
This is so that you can choose when to refresh the data -versus- using cached data. It will send you back to the auth page any time the token has expired when trying to refresh data.

Requires nodejs >= 12

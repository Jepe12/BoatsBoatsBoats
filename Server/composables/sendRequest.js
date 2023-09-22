const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function sendRequest(url, method, body) {
    let settings = { method, body: JSON.stringify(body), headers: {} };

    if (method != 'get') {
        settings.headers = {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        }
    }

    let res = await fetch(url, settings);

    return res;
}

module.exports = { sendRequest }
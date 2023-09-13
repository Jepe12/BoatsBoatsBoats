async function sendRequest(url, method, body) {
    let settings = { method, body: JSON.stringify(body) };

    if (method != 'get') {
        settings.headers = {
            Accept: 'application.json',
            'Content-Type': 'application/json'
        }
    }

    return fetch(url, settings);
}
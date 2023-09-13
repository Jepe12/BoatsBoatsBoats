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

function CookiesHelper() {}

// usage
// CookiesHelper.createCookie("myCookieUniqueName", value, 30);
// CookiesHelper.createCookie("myJsonCookieUniqueName", json, 30);
CookiesHelper.createCookie = function(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }

    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

// usage
// var value = CookiesHelper.readCookie("myCookieUniqueName");
// var json = JSON.parse(CookiesHelper.readCookie("myJsonCookieUniqueName");
CookiesHelper.readCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

CookiesHelper.eraseCookie = function(name) {
    createCookie(name, "", -1);
}
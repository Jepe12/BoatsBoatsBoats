async function sendRequest(url, method, body, ignore401) {
    let settings = { method, body: JSON.stringify(body), headers: {} };

    if (method != 'get') {
        settings.headers = {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        }
    }

    if (localStorage.getItem("accessToken")) {
        settings.headers["Authorization"] = "Bearer " + localStorage.getItem("accessToken")
    }

    let res = await fetch(url, settings);

    if (res.status == 401 && !ignore401) {
        console.log("Unauthorized, refreshing token");
        
        // Unauthorized, refresh token
        const refreshResponse = await fetch("/refresh", { method: "get", credentials: 'include' });

        if (refreshResponse.status != 200) {
            console.warn("Refresh request failed.");
            return res;
        }

        let token = await refreshResponse.json();

        localStorage.setItem("accessToken", token.accessToken);
     
        return sendRequest(url, method, body, true);
    }

    return res;
}

async function logout() {
    try {
        await sendRequest('/logout', 'get');
        window.location = '/'
    } catch (e) {
        console.warn('Failed to logout')
    }
}

// Helper by litodam
// https://gist.github.com/litodam/3048775
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
    CookiesHelper.createCookie(name, "", -1);
}
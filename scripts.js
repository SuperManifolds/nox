/* jslint browser: true */
/* global Textual */

/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

Textual.viewFinishedLoading = function() {
    Textual.fadeInLoadingScreen(1.00, 0.95);
    
    setTimeout(function() {
        Textual.scrollToBottomOfView();
    }, 500);
};

Textual.viewFinishedReload = function() {
    Textual.viewFinishedLoading();
};

Textual.newMessagePostedToView = function (line) {
    var message = document.getElementById('line-' + line);
    if (message.getAttribute('ltype') == 'privmsg' || message.getAttribute('ltype') == 'action') {
        var selectNick = message.children[0].children[1].children[0];
        selectNick.removeAttribute('colornumber');
        selectNick.style.color = get_color(selectNick.getAttribute('nick'));
        var inlineNicks = message.children[0].children[1].querySelectorAll('.inline_nickname');
        for (var i = 0, len = inlineNicks.length; i < len; i++) {
            inlineNicks[i].removeAttribute('colornumber');
            inlineNicks[i].style.color = get_color(inlineNicks[i].innerHTML);
        }
    }
};

/* irccloud-colornicks by Alex Vidal. See LICENSE for copyright.  */

function clean_nick(nick) {
    // attempts to clean up a nickname
    // by removing alternate characters from the end
    // nc_ becomes nc, avidal` becomes avidal
    nick = nick.toLowerCase();
    // typically ` and _ are used on the end alone
    nick = nick.replace(/[`_]+$/, '');
    // remove |<anything> from the end
    nick = nick.replace(/|.*$/, '');
    return nick;
}

function hash(nick) {
    var cleaned = clean_nick(nick);
    var h = 0;
    for(var i = 0; i < cleaned.length; i++) {
        h = cleaned.charCodeAt(i) + (h << 6) + (h << 16) - h;
    }
    return h;
}

function get_color(nick) {
    var nickhash = hash(nick);
    // get a positive value for the hue
    var deg = nickhash % 360;
    var h = deg < 0 ? 360 + deg : deg;
    // default L is 50
    var l = 50;
    // half of the hues are too light, for those we
    // decrease lightness
    if(h >= 30 && h <= 210) {
        l = 40;
    }
    // keep saturation above 20
    var s = 20 + Math.abs(nickhash) % 80;
    
    // Avoid muddy colours.
    if (h < 110 && s < 60) {
        l = 60;
    }
    return "hsl(" + h + "," + s + "%," + l + "%)";
}
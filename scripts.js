/* jslint browser: true */
/* global Textual */

/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

//Optional: Set to true to make /me messages appear in the same color as the username.
var overrideActions = true;

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
	var messageContainer = message.children[0].children[1];
	if (message.getAttribute('ltype') == 'privmsg' || message.getAttribute('ltype') == 'action') {
        //Start alternative nick colouring procedure
        var selectNick = messageContainer.children[0];
        selectNick.removeAttribute('colornumber');
        var nickcolor = get_color(selectNick.getAttribute('nick'));
        selectNick.style.color = nickcolor;
        var inlineNicks = messageContainer.querySelectorAll('.inline_nickname');
        if (message.getAttribute('ltype') == 'action' && overrideActions) {
            selectNick.children[0].style.color = nickcolor;
            messageContainer.style.color = nickcolor;
        }
        for (var i = 0, len = inlineNicks.length; i < len; i++) {
            inlineNicks[i].removeAttribute('colornumber');
            var nick = inlineNicks[i].innerHTML;
            if (inlineNicks[i].getAttribute('mode').length > 0) {
                nick = nick.replace(inlineNicks[i].getAttribute('mode'), '');
            }
            inlineNicks[i].style.color = get_color(nick);
        }
    }
};


/* Based on irccloud-colornicks by Alex Vidal. See LICENSE for copyright.  */

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
    var deg = nickhash % 360;
    var h = deg < 0 ? 360 + deg : deg;
    var l = Math.abs(nickhash) % 110;
    if(h >= 30 && h <= 210) {
        l = 40;
    }
    var s = 20 + Math.abs(nickhash) % 80;
    if (h >= 210 && s >= 80) {
        s = s-30;
    }
    if ((h < 110 && s < 60) || l <= 30) {
        l = l + 30;
    }
    if (l > 80) { 
        l = l - 20;
    }
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

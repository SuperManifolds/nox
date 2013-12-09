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

//Update text wrapping on window resize
var resizeTimeout;
window.onresize = function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            var lines = document.getElementById('body_home').children;
            for (var i = 0; i < lines.length; i++) { 
                var messageContainer = lines[i].children[0].children[1];
                var calcWidth = (lines[i].offsetWidth - lines[i].children[0].children[0].offsetWidth - 210);
                messageContainer.style.width = calcWidth.toString() + "px";
            }
        }, 250); 
    };

Textual.newMessagePostedToView = function (line) {
    var message = document.getElementById('line-' + line);
    //Correct text wrapping programatically
    var messageContainer = message.children[0].children[1];
    //Subtract nick indentation area and timestamp size (and 40px in padding) from the line width 
    var calcWidth = (message.offsetWidth - message.children[0].children[0].offsetWidth - 210);
    messageContainer.style.width = calcWidth.toString() + "px";
    if (message.getAttribute('ltype') == 'privmsg' || message.getAttribute('ltype') == 'action') {
        //Start alternative nick colouring procedure
        var selectNick = messageContainer.children[0];
        selectNick.removeAttribute('colornumber');
        selectNick.style.color = get_color(selectNick.getAttribute('nick'));
        var inlineNicks = messageContainer.querySelectorAll('.inline_nickname');
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
    
    // Prevent text from becing unreadably high on dark themes on certain parts of the hues.
    if (h >= 210 && s >= 80) {
        s = s-20;
    }
    
    // Avoid muddy colours.
    if (h < 110 && s < 60) {
        l = 60;
    }
    return "hsl(" + h + "," + s + "%," + l + "%)";
}
var help = {
    message: 'Produce a shitty, low-quality quote from iheartquotes.com'
};

var http = require('http'),
    expressionSQ = /\!\b(shittyquote)\b/i,
    expressionWisdom = /\!\b(wisdom)\b/i,
    expressionEinstein = /\!\b(einstein)\b/i,
    max_lines = 1,
    max_characters = 255,
    api_url = 'http://iheartquotes.com/api/v1/random?format=json&max_lines=' + max_lines + '&max_characters=' + max_characters;

var getQuote = function (bot, to, source) {
    var url = api_url;
    if (source) {
        url += "&source=" + source;
    }
    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            bot.say(to, response.quote);
        });
    }).on('error', function(e) {
          bot.say(to, 'Error getting quote. I sleep now.');
    });
};

var parse = function (args) {
    var source = false;

    if (args.message.match(expressionSQ)) {
        source = '';
    } else if (args.message.match(expressionWisdom)) {
        source = 'wisdom';
    } else if (args.message.match(expressionEinstein)) {
        source = 'albert_einstein';
    }

    if (source) {
        getQuote(args.bot, args.to, source);
    }

    return null;
};

module.exports = {
    parse: parse,
    help: help
};
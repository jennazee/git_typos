var fs = require('fs');
var Levenshtein = require('levenshtein');
var Twit = require('twit');

function getGitTypos() {
  var typos = [];
  cmds = fs.readFileSync('./cmds.txt', 'utf8').split(/\s+/);
  fs.readFile('./words.txt', 'utf8', function(err, data) {
    if (err) throw err
    words = data.split(/\s+/);
    for (var i = 0; i < words.length; i++) {
      for (var j = 0; j < cmds.length; j++) {
        if (words[i].length > 2) {
          var l = new Levenshtein(words[i].toLowerCase(), cmds[j]);
          if (l.distance === 1) {
            typos.push(words[i].toLowerCase());
            break
          }
        }
      }
    }
    bot(typos);
  })
}

function bot(typos) {
  var T = new Twit({
      consumer_key:         'REDACTED'
    , consumer_secret:      'REDACTED'
    , access_token:         'REDACTED'
    , access_token_secret:  'REDACTED'
  })

  postStatus();
  intID = setInterval(postStatus, 6*60*60*1000);

  function postStatus() {
    if (typos.length === 0) {
      clearInterval(intID);
      return;
    }
    T.post('statuses/update', { status: 'git ' + typos.shift()}, function(err, data, resp) {
      if (err) {
        console.log(err);
      }
    })
  }
}

getGitTypos();



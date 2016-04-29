'use strict';

var watson = require('watson-developer-cloud');
var config = require('./config.js');
var alchemy_language = watson.alchemy_language({api_key: config.services.alchemy_api_key});
var request = require('request');



function getNewsAbout(name, callback) {
  var url = config.services.alchemy_news_url;
  var params = {
    'apikey': config.services.alchemy_api_key,
    'outputMode': 'json',
    'start': 'now-14d',
    'end': 'now',
    'count': '5',
    'q.enriched.url.enrichedTitle.entities.entity': '|text=' + name + ',type=company|',
    'return': 'enriched.url.url,enriched.url.title,enriched.url.image'
  };
  request({url: url, qs: params}, function(error, response, body) {
    if (error) {
      return callback(error);
    }
    var news = JSON.parse(body);
    if (news.status == 'ERROR') {
      var newsError = {
        error: news.statusInfo
      };
      console.error('error:', newsError);
      return callback(newsError);
    }
    // No news found
    if (!news.result.docs) {
      var emptyError = new Error("No news found for " + name);
      emptyError.error = 'content-is-empty';
      emptyError.code = 400;
      return callback(emptyError);
    }
    var _news = news.result.docs.map(function(doc){
      var entry = doc.source.enriched.url;
      return {
        image: entry.image,
        url: entry.url,
        title: entry.title
      };
    });
    callback(null, _news);
  });
}

function getSentiment(text, callback) {
  var params = {text: text}
  alchemy_language.sentiment(params, function(err, response) {
    if (err) {
      return callback(err);
    }
    callback(null, response.docSentiment);
  });
}


function getKeywords(req, callback) {
console.log(' in watson getkeywords req url: ' + req.body.url);
  var params = {url: req.body.url};
  alchemy_language.keywords(params, function(err, keywords) {
	if (err) {
	  return callback(err);
	}
	callback(null,keywords);
  });
}

function getEntities(req, callback) {
  var params = {url: req.body.url};
  alchemy_language.entities(params, function(err, entities) {
	if (err) {
	  return callback(err);
	}
	callback(null,entities);
  });
}

module.exports.getSentiment = getSentiment;
module.exports.getKeywords = getKeywords;
module.exports.getEntities = getEntities;
//module.exports.getNewsAbout = getNewsAbout;

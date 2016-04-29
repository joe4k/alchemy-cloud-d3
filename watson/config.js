'use strict';

// .dotenv is needed to load env variables from .env file
// typically this would hold authentication information for local dev
// require('dotenv').load({silent: true});

var extend = require('extend');

var services = {
  // http://www.alchemyapi.com/api/register.html
  alchemy_news_url: process.env.ALCHEMY_NEWS_URL || 'https://access.alchemyapi.com/calls/data/GetNews',
  alchemy_api_key: process.env.ALCHEMY_API_KEY || 'ENTER_YOUR_APIKEY_HERE',
};

function getBluemixServiceConfig(name) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  for (var service_name in services) {
    if (service_name.indexOf(name) === 0) {
      var service = services[service_name][0];
      return {
        url: service.credentials.url,
        username: service.credentials.username,
        password: service.credentials.password
      };
    }
  }
  console.error('The service '+name+' is not in VCAP_SERVICES, did you forget to bind it?');
  return {};
}

module.exports = {
  services: services,
  host: process.env.HOST || process.env.VCAP_APP_HOST ||'127.0.0.1',
  port: process.env.PORT || process.env.VCAP_APP_PORT || 8080
};

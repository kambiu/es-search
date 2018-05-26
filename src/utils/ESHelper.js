var elasticsearch = require('elasticsearch');
var app = require('../config');

var eshost = app.elasticsearch.host + ":" + app.elasticsearch.port;
var esclient = new elasticsearch.Client({
  host: eshost,
  log: app.loglevel
});

module.exports = esclient;
var appcfg = {};

appcfg.elasticsearch = {};
appcfg.elasticsearch.host = "localhost";
appcfg.elasticsearch.port = "9200";

appcfg.search = {}
appcfg.search.index = ["*"]

appcfg.search.aggregation = {};
appcfg.search.fields = {};

appcfg.loglevel = "trace";

module.exports = appcfg;

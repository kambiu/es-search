var appcfg = {};

appcfg.elasticsearch = {};
appcfg.elasticsearch.host = "localhost";
appcfg.elasticsearch.port = "9200";

appcfg.search = {}
appcfg.search.index = ["*"]

appcfg.search.aggregation = {};

//active is bool instead of text
appcfg.search.aggregation.terms_fields = ["grade"]

appcfg.search.aggregation.range_fields = [
  {
    field_name: "age",
    groups: [
      {
        to: 15
      },
      {
        from: 16,
        to: 30
      },
      {
        from: 31,
      }
    ]
  },
  {
    field_name: "price",
    groups: [
      {
        to: 100.0
      },
      {
        from: 101.0,
        to: 150.0
      },
      {
        from: 151.0,
      }
    ]
  },
]


appcfg.search.fields = {};

appcfg.loglevel = "debug";


module.exports = appcfg;

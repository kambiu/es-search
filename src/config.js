var appcfg = {};

appcfg.elasticsearch = {};
appcfg.elasticsearch.host = "localhost";
appcfg.elasticsearch.port = "9200";

appcfg.search = {}
appcfg.search.index = ["*"]

appcfg.search.aggregation = {};

appcfg.search.aggregation.show_empty_bucket = false;
// labels are auto detect as result.custom.filter[<field_name>]
appcfg.search.aggregation.terms_fields = ["grade"]
//active is bool instead of text

// labels are auto detect as result.custom.filter[<field_name>]
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

appcfg.languages=["en-us", "zh-hk", "zh-cn"]

module.exports = appcfg;

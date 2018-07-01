var appcfg = require('../config');

const func = {
  sayHello() {
    var a = appcfg.elasticsearch;
    console.log(a);
    return "hello";
  },
  getBasicSearchQuery(text) {
    return {
      bool: {
        must: [
          { 
            query_string: {
              default_field : "content",
              query : text
            }
          }
        ],
        must_not: [],
        filter: []
      }
    }
  },
  getAggregations() {    
    var aggs = {}

    for (let field of appcfg.search.aggregation.terms_fields) {
      console.log(field);
      aggs["terms_" + field] = {
        "terms": { "field": field }
      }
    }

    //range
    for (let obj of appcfg.search.aggregation.range_fields) {
      aggs["ranges_" + obj.field_name] = {
        "range": {
          "field": obj.field_name,
          "ranges": obj.groups
        }
      }
    }
    return aggs;
  }
};

export default func;
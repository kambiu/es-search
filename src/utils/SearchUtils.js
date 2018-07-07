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
  },
  getAdvancedSearchQuery(adv_request) {
    
    var ret_query  = {
      bool: {
        must: [],
        must_not: [],
        filter: []
      }
    }
    // Any of these words
    if (adv_request.text_or) {
      ret_query.bool.must.push(
        {
          match: { content: adv_request.text_or } 
        }
      )
    }
    // All of these words
    if (adv_request.text_and) {
      ret_query.bool.must.push(
        {
          match: { 
            content: {
              query: adv_request.text_and, 
              operator: "and"
            }
          }
        }
      )
    } 
    // Exact phrase
    if(adv_request.text_exact){
      ret_query.bool.must.push(
        { 
          match_phrase: { content: adv_request.text_exact }
        }
      )
    } 
    // None of these words
    if(adv_request.text_not){
      ret_query.bool.must_not.push(
        {
          match: { content: adv_request.text_not }
        }
      )
    }

    // date

    if (adv_request.date.from && adv_request.date.to) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: {
              gte: adv_request.date.from + " 00:00:00",
              lte: adv_request.date.to + " 00:00:00"
            }
          }
        }
      )
    } else if (adv_request.date.from) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: { gte: adv_request.date.from + " 00:00:00" }
          }
        }
      )
    } else if (adv_request.date.to) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: { lte: adv_request.date.to + " 00:00:00" }
          }
        }
      )
    }

    return ret_query;
  } // end parse advanced search query

};

export default func;
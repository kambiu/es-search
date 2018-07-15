var appcfg = require('../config');

const func = {
  sayHello() {
    var a = appcfg.elasticsearch;
    console.log(a);
    return "hello";
  }
  ,
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
  }
  ,
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
  }
  ,
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

    // date , need to convert date to another date format

    if (adv_request.date.from && adv_request.date.to) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: {
              gte: adv_request.date.from.toISOString().substring(0, 10) + " 00:00:00",
              lte: adv_request.date.to.toISOString().substring(0, 10) + " 00:00:00"
            }
          }
        }
      )
    } else if (adv_request.date.from) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: { gte: adv_request.date.from.toISOString().substring(0, 10) + " 00:00:00" }
          }
        }
      )
    } else if (adv_request.date.to) {
      ret_query.bool.must.push(
        {
          range: { 
            date_modified: { lte: adv_request.date.to.toISOString().substring(0, 10) + " 00:00:00" }
          }
        }
      )
    }

    return ret_query;
  } // end parse advanced search query
  ,
  aggs2TreeData(aggregations) {
    var arr_tree = []; //complete tree

    // loop fields
    for (var key in aggregations) {
      var new_tree = {}; // tree for a signle field
      new_tree.aggs_type = key.split("_")[0];
      new_tree.field_name = key.split("_")[1];
      new_tree.buckets = []
      // loop the buckets of this field
      for (let bucket of aggregations[key].buckets) {
        //only show filter where count > 1
        if (appcfg.search.aggregation.show_empty_bucket == false) {
          if (parseInt(bucket.doc_count) == 0)
            continue;
        }
        var tree_bucket = {
          key: bucket.key,
          count: bucket.doc_count
        }
        if (new_tree.aggs_type == "terms") {
          // nth here else
        } else if (new_tree.aggs_type == "ranges") {
          tree_bucket.from = bucket.from;
          tree_bucket.to = bucket.to;
        }        
        new_tree.buckets.push(tree_bucket);
      } // end loop bucket of a field tree

      /* add a field tree to complete tree */
      arr_tree.push(new_tree);

    }
    return arr_tree;
  }
  ,
  getTreeNodeData(field_name, aggs_type, bucket) {
    var ret_label = { 
      label: bucket.key + " (" + bucket.count + ")",
      filter_param: {}
    }

    /* terms filter */
    if (aggs_type == "terms") { 
      ret_label.filter_param.term = {}
      ret_label.filter_param.term[field_name] = bucket.key

    /* ranges filter */
    } else if (aggs_type == "ranges"){
      /* includes terms */
      ret_label.filter_param.range = {}
      ret_label.filter_param.range[field_name] = {}
      if (bucket.from) {
        ret_label.filter_param.range[field_name].gte = bucket.from;
      }
      if (bucket.to) {
        ret_label.filter_param.range[field_name].lt = bucket.to;
      }
    /* other filter */
    } else {
      ret_label.filter_param = null
    }
    return ret_label;
  }
};

export default func;
var ns = {}

// varaible namespce
ns.searchType = {}
ns.searchType.basic = 0
ns.searchType.advanced = 1


ns.basicAction = {}
ns.basicAction.search = 0
ns.basicAction.showAdvancedPage = 1

ns.advancedAction = {}
ns.advancedAction.search = 0
ns.advancedAction.showBasicPage = 1

ns.resultAction = {}
ns.resultAction.showAdvancedPage = 0
ns.resultAction.doBasicSearch = 1
ns.resultAction.changePage = 2
ns.resultAction.changeSorting = 3
ns.resultAction.filterSearch = 4
ns.resultAction.clearFilter = 5


// text namespce
ns.label = {}
ns.label.result = {}
ns.label.result.aggs = {}
ns.label.result.aggs.terms = {
  grade: "Grade Filtering",
  active: "Active Filtering"
}
ns.label.result.aggs.range = {
  age: "Age Filtering",
  price: "Price Filtering"
}
module.exports = ns;

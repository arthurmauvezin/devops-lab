exports.selection = function selection(req, queryString) {
  const selectionFilter = require('./rq0_selection.js')
  return selectionFilter.selection(req, queryString)
}

exports.sorting = function sorting(req, queryString) {
  const sortingFilter = require('./rq1_sorting.js')
  return sortingFilter.sorting(req, queryString)
}

exports.filtering = function filtering(req, queryString) {
  const filteringFilter = require('./rq2_filtering.js')
  return filteringFilter.filtering(req, queryString)
}

exports.pagination = function pagination(req, queryString) {
  const paginationFilter = require('./rq3_pagination.js')
  return paginationFilter.pagination(req, queryString)
}

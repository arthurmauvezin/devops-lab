exports.sorting = function sorting(req, queryString) {
  if ("sort" in req.query) {
    var sort = req.query["sort"].split(",")
    queryString += " ORDER BY "

    for (var index in sort) {
      var direction = sort[index].substr(0, 1)
      var field = sort[index].substr(1)

      queryString += field

      if (direction == "-") {
        queryString += " DESC,"
      } else {
        queryString += " ASC,"
      }
    }
    queryString = queryString.slice(0, -1)
  }
  return queryString
}

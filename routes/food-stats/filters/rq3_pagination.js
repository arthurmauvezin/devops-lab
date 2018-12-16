exports.pagination = function pagination(req, queryString) {
  if ("limit" in req.query) {
    queryString += " LIMIT " + req.query["limit"]
    if ("offset" in req.query) {
      queryString += " OFFSET " + req.query["offset"]
    }
  }
  return queryString
}

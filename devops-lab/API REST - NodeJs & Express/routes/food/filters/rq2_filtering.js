exports.filtering = function filtering(req, queryString) {
  if ("fields" in req.query) {
    queryString = queryString.replace("*", req.query["fields"])
  }
  return queryString
}

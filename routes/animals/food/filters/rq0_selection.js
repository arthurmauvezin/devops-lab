exports.selection = function selection(req, queryString) {
  const conditions = ["name", "animal", "quantity"]
  for (var index in conditions) {
    if (conditions[index] in req.query) {
      if (queryString.indexOf("WHERE") < 0) {
        queryString += " WHERE "
      } else {
        queryString += " AND "
      }
      queryString += " " + conditions[index] + " = \"" + req.query[conditions[index]] + "\""
    }
  }
  return queryString
}

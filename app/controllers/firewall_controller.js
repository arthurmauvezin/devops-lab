var db = require('../../config/database.js');
// SET UP FIREWALL
exports.firewall = function(req, res,next) {
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                next();
            }
            else {
                res.status(403).send("Access denied").end();
            }
        });
    } else {
        res.status(403).send("Access denied").end();
    }
};

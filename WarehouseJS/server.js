/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0, no-unused-vars: 0*/
//test by I318642

var express = require("express");
var app = express();

var xsenv = require("@sap/xsenv");
var hdbext = require("@sap/hdbext");

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

app.use(
	hdbext.middleware(hanaOptions.hana)
);
//app.use(express.static(__dirname + '/webapp'));

app.get('/Location', function (req, res) {
	req.db.exec('SELECT * FROM "IC2019.WarehouseDB::tables.Location"', function (err, results) {
		if (err) {
			res.type("text/plain").status(500).send("ERROR: " + err.toString());
			return;
		}
		res.status(200).json(results);
	});
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.info("Listening on port: " + port);
});
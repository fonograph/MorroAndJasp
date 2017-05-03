//process.argv.length == 3 ? process.argv[2] : null

var fs = require('fs')
fs.readFile('./src/script.json', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	var result = data.replace(/\{"\$numberLong":"(\d)"\}/g, "$1");

	fs.writeFile('./src/script.json', result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

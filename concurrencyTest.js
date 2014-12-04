var mongojs = require('mongojs');

// Usage
var usage = function()
{
	console.log('node concurrencyTest.js {0=divisible|1=atomic}');
}

var verifyName = function(dbcollection, desiredName, endfunc) {
	dbcollection.findOne({name: desiredName}, function(err, doc) {
		if (doc === null) {
			console.log('MISMATCH');
		} else {
			// console.log('OK');
		}

		endfunc();
	});
}

// The main function
var main = function(atomic) {
	var nameLength = 100000;
	var nameChars = parseInt(Math.random() * 1000000);
	var name = Array(nameLength).join(nameChars);

	var db = mongojs.connect('concdb', ['conctc']);

	if (atomic === 0) {
		// Get the first document.
		db.conctc.findOne({name: ''}, function(err, doc) {
			if (doc === null) {
				// Another process already changed the name.
				db.close();
				return;
			}

			doc.name = name;

			// Waste time to mimic a really slow/bogged-down machine.
			for (var i = 0; i < 1000000; i++);

			db.conctc.update({_id: doc._id}, doc, function() {
				// Verify that the name is the same.
				verifyName(db.conctc, name, function() {
					db.close();
				});
			});
		});
	}
	else {
		// Get the first document.
		db.conctc.update({name: ''}, {$set: {name: name}}, function(err, stats) {
			if (stats.n === 0) {
				// Another process already changed the name.
				db.close();
				return;
			}

			// Waste time to mimic a really slow/bogged-down machine.
			for (var i = 0; i < 1000000; i++);

			// Verify that the name is the same.
			verifyName(db.conctc, name, function() {
				db.close();
			});
		});
	}
}

if (process.argv.length != 3)
{
	usage();
	return -1;
}

main(parseInt(process.argv[2], 10))

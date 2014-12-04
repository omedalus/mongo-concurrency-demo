var mongojs = require('mongojs');

// The main function
var main = function() {
	var nameLength = 100000;
	var nameChars = parseInt(Math.random() * 1000000);
	var name = Array(nameLength).join(nameChars);

	var db = mongojs.connect('concdb', ['conctc']);

	// Delete all docs in the collection.
	db.conctc.remove({}, function() {
		// Insert one matching doc.
		db.conctc.insert({name: ''}, function() {
			db.close();
		});
	});
}

main()

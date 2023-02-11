var store = require("nedb")
var fs = require('fs');

var expenses = new store({ filename: "expense.db", autoload: true })

expenses.find({}, function (err, docs) {
    if (docs.length == 0) {
        loadExpenses();
    }
})

function loadExpenses() {
    readCsv("data.csv", function (data) {
        console.log(data);

        data.forEach(function (rec, idx) {
            item = {}
            item.name = rec[0];
            item.amount = parseFloat(rec[1]);
            item.spend_date = new Date(rec[2]);
            item.category = rec[3];

            expenses.insert(item, function (err, doc) {
                console.log('Inserted', doc.item_name, 'with ID', doc._id);
            })
        })
    })
}

function readCsv(file, callback) {
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) throw err;
        var lines = data.split('\r\n');
        var result = lines.map(function (line) {
            return line.split(',');
        });
        callback(result);
    });
}
module.exports = expenses
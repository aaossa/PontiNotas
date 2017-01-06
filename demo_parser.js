var cheerio = require('cheerio');

fs = require('fs');
var content;
file = fs.readFile('demo.html', 'utf8', (err, data) => {
	if (err) {
		throw err;
	}
	content = data;
	processFile();
});

function processFile() {
	var $ = cheerio.load(content);
	var FAA = {};
	var currentSemester = '';
	$('table.datadisplaytable').children('tr').each((i, element) => {
		if ($(element).children('td').length == 9) {
			// Course data
			var courseData = '';
			$(element).children('td').each((id, element) => {
				courseData += $(element).text().trim() + ' + ';
			});
			// Save data in array
			FAA[currentSemester].push(courseData);
		} else if ($(element).children('th').length == 8) {
			// Semester data
			currentSemester = $(element).prev().children().children().html();;
			// New semester, new array
			FAA[currentSemester] = [];
		};
	});
	console.log(FAA);
}
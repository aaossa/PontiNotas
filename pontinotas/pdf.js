var images = require('./images');
var pdfMake = require('pdfmake');

var docDefinition = {
	content: [
		'A',
		'B'
	]
}
pdfMake.createPdf(docDefinition).download(username + '.pdf');
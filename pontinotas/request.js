var https = require('https');
var querystring = require('querystring');
var url = require('url');

var parsedLoginUrl = url.parse('https://ssb.uc.cl/ERPUC/twbkwbis.P_ValLogin');
var parsedGradesUrl = url.parse('https://ssb.uc.cl/ERPUC/bwskotrn.P_ViewTran');

var loginData = querystring.stringify({
	sid: process.env.ENV_USER,
	PIN: process.env.ENV_PASS
});
var gradesData = querystring.stringify({
	levl: '',
	tprt: 'FAA'
});

function postRequest(parsedUrl, qsData, cookies) {
	return new Promise((resolve, reject) => {
		var options = {
			hostname: parsedUrl.hostname,
			port: (parsedUrl.port || 443),
			method: 'POST',
			path: parsedUrl.path,
			headers: {
				'Connection': 'keep-alive',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(qsData),
				'Cookie': cookies,
			},
		};
		const request = https.request(options, (response) => {
			const body = [];
			response.on('data', (chunk) => body.push(chunk));
			response.on('end', () => resolve([response.headers, body.join('')]));
		});
		request.on('error', (err) => reject(err));
		request.write(qsData);
		request.end();
	});
};

var cookies = 'TESTID=set,SESSID=; expires=Mon, 01-Jan-1990 08:00:00 GMT';

var getFAA = function() {
	postRequest(parsedLoginUrl, loginData, cookies)
		.then(([headers, body]) => {
			return postRequest(parsedGradesUrl, gradesData, headers['set-cookie']);
		})
		.then(([headers, body]) => {
			return body;
		})
		.catch(console.log.bind(console));
};
module.exports.getFAA = getFAA;
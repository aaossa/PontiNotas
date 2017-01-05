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

var optionsGetLogin = {
    hostname: parsedLoginUrl.hostname,
    port: (parsedLoginUrl.port || 443), // 80 => http, 443 => https
    method: 'GET',
    path: parsedLoginUrl.path,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
    },
};
var optionsPostLogin = {
    hostname: parsedLoginUrl.hostname,
    port: (parsedLoginUrl.port || 443),
    method: 'POST',
    path: parsedLoginUrl.path,
    headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(loginData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
    },
};
var optionsPostGrades = {
    hostname: parsedGradesUrl.hostname,
    port: (parsedGradesUrl.port || 443),
    method: 'POST',
    path: parsedGradesUrl.path,
    headers: {
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(gradesData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
    },
};

const getLogin = function(options) {
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            console.log('>> Set-Cookie (getLogin): ' + response.headers['set-cookie']);
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(response.headers));
        });
        request.on('error', (err) => reject(err));
        request.end();
    });
};
const postLogin = function(options, cookies) {
    return new Promise((resolve, reject) => {
        options['headers']['Cookie'] = cookies;
        const request = https.request(options, (response) => {
            console.log('>> Enviada (postLogin): ' + options['headers']['Cookie']);
            console.log('>> Recibida (postLogin): ' + response.headers['set-cookie']);
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(response.headers));
        });
        request.on('error', (err) => reject(err));
        request.write(loginData);
        request.end();
    });
};
const postGrades = function(options, cookies) {
    return new Promise((resolve, reject) => {
        options['headers']['Cookie'] = cookies;
        const request = https.request(options, (response) => {
            console.log('>> Enviada (postLogin): ' + options['headers']['Cookie']);
            console.log('>> Recibida (postGrades): ' + response.headers['set-cookie']);
            console.log(response.statusCode);
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join(''), response.headers)); // resolve(body.join('')));
        });
        request.on('error', (err) => reject(err));
        request.write(gradesData);
        request.end();
    });
};

getLogin(optionsGetLogin)
    .then(function(loginHeaders) {
        console.log(loginHeaders);
        postLogin(optionsPostLogin, loginHeaders['set-cookie'])
            .then(function(gradesGetHeaders) {
                console.log();
                console.log(gradesGetHeaders);
                postGrades(optionsPostGrades, gradesGetHeaders['set-cookie'])
                    .then(function(body, gradesPostHeaders) {
                        console.log();
                        console.log(body);
                        console.log(gradesPostHeaders);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
// Create web server
// Run: node comments.js
// Open in browser at http://localhost:8080

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  var query = url.parse(request.url).query;
  var queryObj = qs.parse(query);
  var method = request.method;
  console.log('Request for ' + path + ' received.');
  console.log('method: ' + method);
  console.log('query: ' + query);
  console.log('queryObj: ' + queryObj);
  if (method === 'GET') {
    if (path === '/') {
      fs.readFile('./index.html', function (err, html) {
        if (err) {
          throw err;
        }
        response.writeHeader(200, {'Content-Type': 'text/html'});
        response.write(html);
        response.end();
      });
    } else if (path === '/getComments') {
      fs.readFile('./comments.json', function (err, data) {
        if (err) {
          throw err;
        }
        response.writeHeader(200, {'Content-Type': 'application/json'});
        response.write(data);
        response.end();
      });
    }
  } else if (method === 'POST') {
    if (path === '/addComment') {
      var reqBody = '';
      request.on('data', function (data) {
        reqBody += data;
      });
      request.on('end', function () {
        var newComment = JSON.parse(reqBody);
        fs.readFile('./comments.json', function (err, data) {
          if (err) {
            throw err;
          }
          var comments = JSON.parse(data);
          comments.push(newComment);
          fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), function (err) {
            if (err) {
              throw err;
            }
            console.log('Comment saved!');
          });
        });
      });
    }
  }
});

// Listen on port 8080, IP defaults to
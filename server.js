'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.get('/', function(req, res) {
	var ua   = req.headers['user-agent'];
	var lang = req.headers["accept-language"];
	
	var obj = {
		"ipaddress": undefined,
		"language" : undefined,
		"software" : undefined
	};
	
	// software
	var regex  = new RegExp(/\(/);
	var regex2 = new RegExp(/\)/);
	var startIndex = ua.search(regex);
	var endIndex   = ua.search(regex2);
	var software = ua.substring(startIndex+1, endIndex);
	obj["software"] = software;
	
	// language
	var regex3 = new RegExp(/,/);
	var langEndIndex = lang.search(regex3);
	var language = lang.substring(0, langEndIndex);
	obj["language"] = language;
	
	// ip
	var ip = req.headers['x-forwarded-for'];
	obj["ipaddress"] = ip;
	
	res.send(JSON.stringify(obj));
})


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
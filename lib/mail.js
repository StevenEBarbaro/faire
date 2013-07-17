var internals = {};
//sendmail method
internals.sendPlainEmail = function(from, to, subject, body) {
	var nodemailer = require('nodemailer'),
		CheckTypeOf = require('./util').CheckTypeOf;
	var transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

	var message = {
		from: from,
		// to is Comma separated list of recipients
		to: CheckTypeOf.GetArrayFromString(to).join(),//'"Chris Bebry" <invalidsyntax@gmail.com>',
		subject: subject,
		// plaintext body
		text: body
	};
	transport.sendMail(message, function(error){
		if(error){
			console.log('Error occured');
			console.log(error.message);
			return;
		}
		console.log('Message sent successfully!');
	});
}
/*
module.exports = function(req) {
	var nodemailer = require('nodemailer');
	// Create a Sendmail transport object
	var transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");
	console.log('Sendmail Configured');
	// Message object
	var message = {
		// sender info
		from: 'Chris Bebry <invalidsyntax@gmail.com>',
		// Comma separated list of recipients
		to: '"Chris Bebry" <invalidsyntax@gmail.com>',
		// Subject of the message
		subject: 'Nodemailer is unicode friendly', //
		// plaintext body
		text: 'Hello to myself!',
		// HTML body
		html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'
	};
	console.log('Sending Mail');
	transport.sendMail(message, function(error){
		if(error){
			console.log('Error occured');
			console.log(error.message);
			return;
		}
		console.log('Message sent successfully!');
	});
	req.reply("OK"); 
}
*/
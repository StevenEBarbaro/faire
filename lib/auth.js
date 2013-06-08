var internals = {};
internals.redirectAfterFailure = '/';
internals.data = require('../app/models');

//TODO test
internals.doesMetastateHashkeyHaveUser = function(hashkey, callback) {
	internals.data.Metastate.find({
		hashkey: hashkey
	}).success(function(metastate) {
		if (metastate != null) {
			internals.data.User.find({
				id: metastate.UserId
			}).success(function(user) {
				if (user != null) {
					//validated!
					callback(null, true);
				} else {
					//not a match!
					callback(null, false);
				}
			});
		} else {
			//not a match!
			callback(null, false);
		}
	});
}

internals.confirm = function() {
	var request = this;
	internals.doesMetastateHashkeyHaveUser(this.params.hashkey, function(err, result) {
		if (!result) {
			request.reply({ temporary: false });//temporary response for testing
			//TODO: uncomment following when testing is done
			//this.reply.redirect(internals.redirectAfterFailure);
		} else {
			//TODO: deactivate the metastate confirmation record and do steps to activate the accompanying user
			request.reply({ temporary: true });//temporary response for testing
		}
	});
}
//TODO
internals.register = function() {
	if (!this.payload) {
		console.log("Not a payload");
	} else {
		console.log("A payload");
		//var userid = this.payload.userid;
		//console.log("userid: "+userid);
		//TODO:
		// 1.) take in payload (this.payload.parametername) and grab each parameter
		//		userid, email, passwrd, passwrd0 (confirmation)
		var userid = this.payload.userid;
		var passwrd = this.payload.passwrd;
		var passwrd0 = this.payload.passwrd0;
		var email = this.payload.email;
		
		// 2.) validate parameters - https://github.com/spumko/hapi/blob/master/examples/validation.js
		//		route validation:: validate: { query: { userid: Hapi.types.String().required().with('passwrd') ...etc } }
		// 3.) create deactivated user with a metastate record. requires creating the metastate hashkey from the user's salt and email
		// 4.) reply status to user of what happened
		// 5.) get rid of temporary stuff
	}

	this.reply({ temporary: null });
}
exports.register_validate = function(hapi) {
	console.log('auth.register_validate()');
	var Hapi = hapi;
	var S = Hapi.types.String;
	return {
		userid: S().required().max(30),
		passwrd: S().required(),
		passwrd0: S().required(),
		email: S().email().required().max(50)
	}
}

exports.confirm = internals.confirm;
exports.register = internals.register;

internals.generateNewHash = function(input, callback) {
    var bcrypt = require('bcrypt');

    var start = Date.now();
    bcrypt.genSalt(10, function(err, salt) {
        console.log('salt: ' + salt);
        console.log('salt cb end: ' + (Date.now() - start) + 'ms');
        bcrypt.hash(input, salt, function(err, crypted) {
            console.log('crypted: ' + crypted);
            console.log('crypted cb end: ' + (Date.now() - start) + 'ms');
            console.log('rounds used from hash:', bcrypt.getRounds(crypted));
        
            var result = {
                salt: salt,
                hash: crypted
            };
        
            callback(null, result);
        });
    })
};

internals.compareHashToPlaintext = function(plaintext, hash, callback) {
    var bcrypt = require('bcrypt');
    
    bcrypt.compare(plaintext, hash, function(err, result) {
        if (err) {
            console.log("Error in auth.internals.compareHashToPlaintext(): " + err);
        }
        callback(err, result);
    });
}

exports.generateNewHash = internals.generateNewHash;
exports.compareHashToPlaintext = internals.compareHashToPlaintext;


//testing data
var users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

exports.login = function () {
  if (this.auth.isAuthenticated) {
    return this.reply.redirect('/');
  }
  var message = '';
  var account = null;
  


  if (this.method === 'post') {

    console.log("un: " + this.payload.username);
    console.log("pw: " + this.payload.password);
    if (!this.payload.username || !this.payload.password) {
      message = 'Missing username or password';
    } else {
      account = users[this.payload.username];
      if (!account || account.password !== this.payload.password) {
        message = 'Invalid username or password';
      }
    }
  }

  if (this.method === 'get' || message) {
    return this.reply('<html><head><title>Login page</title></head><body>'
          + (message ? '<h3>' + message + '</h3><br/>' : '')
          + '<form method="post" action="/login">'
          + 'Username: <input type="text" name="username"><br/>'
          + 'Password: <input type="password" name="password"><br/>'
          + '<input type="submit" value="Login"></form></body></html>');
  }

  this.auth.session.set(account);
  return this.reply.redirect('/');
};

exports.logout = function () {
    this.auth.session.clear();
    return this.reply.redirect('/');
};

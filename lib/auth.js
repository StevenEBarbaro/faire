var internals = {};

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

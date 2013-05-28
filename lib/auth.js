//dont use the module.exports right now thx
/*
module.exports = function() {
  return {
    handler: function(request) {
      request.reply('Success');
    }
  };
}
*/
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

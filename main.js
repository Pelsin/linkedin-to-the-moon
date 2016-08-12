var casper = require("casper").create();

casper.start("http://linkedin.com/", function (response) {
  this.echo(
    response.status === 200 ?
      "Successfully navigated to http://linkedin.com/" :
      "Failed to access http://linkedin.com/, go play some Pokemon GO instead"
  );
});

casper.waitForSelector("form.login-form", function () {
  this.echo("Inserting credentials");

  this.fillSelectors("form.login-form", {
    "#login-email": "",
    "#login-password": ""
  }, true);
});

casper.then(function () {
  if (this.exists("form[action=/uas/change-password-submit]")) {
    this.echo("Linkedin is asking you to change your password");
  }

  if (this.exists("#session_key-login-error")) {
    this.echo("You inserted the wrong credentials");
    this.echo("--->EXITING<---");
    casper.done();
  }
});

casper.then(function () {
  this.echo("searching for it headhunter stockholm");

  this.fillSelectors("form#global-search", {
    "#main-search-box": "it recruiter stockholm"
  }, true);
});

casper.run();

var casper = require("casper").create();
var instance = require("casper").create();

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
    "#login-email": casper.cli.args[0],
    "#login-password": casper.cli.args[1]
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

casper.waitForSelector('#results-col', function () {
  this.capture('test.png');
});

function getLinks() {
  var links = document.querySelectorAll('.main-headline');
  return Array.prototype.map.call(links, function(e) {
    return e.getAttribute('href');
  });
}

var links = [];
casper.then(function () {
  links = this.evaluate(getLinks);
});

casper.then(function () {
  casper.eachThen(links, function(response) {
    this.capture('victims/person' + Math.random() + '.png');

    this.thenOpen(response.data, function () {
      console.log('Saving victim');
    });
  });
});

casper.run();

'use strict';

var jade = require('jade');
var path = require('path');
var fs = require('fs');
var cache = {};

function read (file, done) {
  if (file in cache) {
    next(); return;
  }

  fs.readFile(file, { encoding: 'utf8' }, function (err, template) {
    if (err) {
      done(err);
    } else {
      jade.parse(template);
      cache[file] = template;
      next();
    }
  });

  function next () {
    done(null, cache[file]);
  }
}

module.exports = {
  defaultLayout: path.join(__dirname, 'layout.jade'),
  render: function (file, model, done) {
    read(file, function (err, template) {
      if (err) {
        done(err);
      } else {
        done(null, jade.render(template, model));
      }
    });
  },
  renderString: function (template, model, done) {
    done(null, jade.render(template, model));
  }
};

'use strict';

var _ = require('lodash');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var cache = {};
var rjade = /\.jade$/i;

function read (file, done) {
  if (!rjade.test(file)) {
    file += '.jade';
  }

  if (file in cache) {
    next(); return;
  }

  fs.readFile(file, { encoding: 'utf8' }, function (err, template) {
    if (err) {
      done(err);
    } else {
      cache[file] = jade.compile(template);
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
    read(file, function (err, fn) {
      if (err) {
        done(err);
      } else {
        done(null, fn(model));
      }
    });
  },
  renderString: function (template, model, done) {
    done(null, jade.render(template, model));
  }
};

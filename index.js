var async = require('async');
var fs = require('fs');
var express = require('express');
var path = require('path');
// internal modules
var routes = require('./src/routes');

var APP_DIR = path.join(__dirname, 'apps');
var app = express();

function init() {
  loadModules();
  fs.readdir(APP_DIR, function(error, contents) {
    makeStaticDir(path.join(__dirname, 'public'));
    async.each(contents, function(item, cb) {
      var itemDir = path.join(APP_DIR, item);
      fs.stat(itemDir, function(error, stats) {
        if(error) return cb(error);
        if(stats.isDirectory()) makeStaticDir(path.join(itemDir, 'public'));
        cb();
      });
    }, function(error) {
      if(error) return console.log(error);
      startServer();
    });
  });
}

function loadModules() {
  routes(app);
}

function makeStaticDir(dir) {
  app.use(express.static(dir));
}

function startServer(cb) {
  app.listen(9516, function(error) {
    if(error) return console.log(error);
    console.log('Server listening');
    if(cb) cb();
  });
}

app.serveFile = function(app, file, res) {
  // TODO need a bit of checking here
  var filepath;
  if(typeof file !== 'string') {
    res = file;
    file = app;
    filepath = path.join(__dirname, 'public', file);
  } else {
    filepath = path.join(APP_DIR, app, 'public', file);
  }
  res.sendFile(filepath);
}

init();

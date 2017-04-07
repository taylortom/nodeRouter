exports = module.exports = function(app) {

  app.get('/', function onRequest(req, res) {
    app.serveFile('index.html', res);
  });

  app.get('/test', function onRequest(req, res) {
    console.log('/test', req.params);
    app.serveFile('test', 'index.html', res);
  });

};

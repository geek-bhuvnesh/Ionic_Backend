'use strict';

var koa = require('koa');
var app = module.exports = koa();
var mount = require("koa-mount");
var bodyParser = require('koa-bodyparser');
var path = require('path');

// Logger
//app.use(logger());

//They take the data from your http POST and parse it into a more usable state
app.use(require('koa-cors')({
   methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS', //'POST,PUT,GET'                               //'GET,HEAD,PUT,POST,DELETE,OPTIONS',
   credentials: true                                            //credentials: true
 }));

// configure our routes

app.use(bodyParser());
//app.use(route(app));

var routes = require('./routes/index');

//app.use('/', routes);

//app.get('/ABC',api.practice); 
 

// Serve static files
//app.use(serve(path.join(__dirname, 'www')));

// Compress
//app.use(compress());

/*app.use(function *(){
  this.body = 'Hello World';
});*/

app.use(function *(next){
  try
    {
    yield next; 
    //pass on the execution to downstream middlewares
    } catch (err) 
    { 
    //executed only when an error occurs & no other middleware responds to the request
    this.type = 'json'; //optiona here
    this.status = err.status || 500;
    this.body = { 'error' : 'The application is not responding because of some error;) '};
    //delegate the error back to application
    this.app.emit('error', err, this);
    }
});
 
 app.use(mount(routes.middleware()));

 app.listen(5500);
 console.log('listening on port 5500');
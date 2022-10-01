const express = require('express')
var createError = require('http-errors');
const next = require('next')
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const indexRouter = require('./api/index')
const usersRouter = require('./api/user')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  // view engine setup
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'jade');

  server.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
  }));

  function auth(req, res, next) {
    if (!req.session.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
    else {
      if (req.session.user === 'authenticated') {
        next();
      }
      else {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        return next(err);
      }
    }
  }

  server.use('/api', auth, indexRouter);
  server.use('/api/users', usersRouter);
  server.use('/detail', auth)
  // server.use(auth);

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // catch 404 and forward to error handler
  server.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  server.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})

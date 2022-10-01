const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({ name: 'MomThu' })
});

router.post('/login', (req, res, next) => {

  if (!req.session.user) {
    // var authHeader = req.headers.authorization;
    var authHeader = req.body;
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    // var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    // var username = auth[0];
    // var password = auth[1];
    var username = authHeader.username;
    var password = authHeader.password;

    if (username == 'admin' && password == 'password') {
      req.session.user = 'authenticated';
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are authenticated!')
    } else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
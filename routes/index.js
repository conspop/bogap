var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/events');
  } else {
    res.render('index');
  }
  
});

module.exports = router;

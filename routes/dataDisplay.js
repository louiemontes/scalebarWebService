var express = require('express');
var router = express.Router();

/* GET form page. */
router.get('/', function(req, res, next) {
  res.render('dataDisplay', { title: 'Displayed Results' });
});

module.exports = router;

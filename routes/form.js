var express = require('express');
var router = express.Router();

/* GET form page. */
let errorHolder = [];
router.get('/', function(req, res, next) {
//  res.render('form', { title: 'Form' });
     res.render('form', {
       title: "Form",
       specificErrors: [
         errorHolder[0] = "",
         errorHolder[1] = "",
         errorHolder[2] = "",
         errorHolder[3] = "",
         errorHolder[4] = "",
         errorHolder[5] = "",
         errorHolder[6] = "",
         errorHolder[7] = "",
         errorHolder[8] = "",
         errorHolder[9] = "",
         errorHolder[10] ="",
         errorHolder[11] =""
       ]
     });


});

module.exports = router;

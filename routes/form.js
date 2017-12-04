var express = require('express');
var router = express.Router();

/* GET form page. */
let errorHolder = [];
let inputHolder = [];

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
         errorHolder[10] = ""
       ],
       specificInputs: [
         inputHolder[0] = "",
         inputHolder[1] = "",
         inputHolder[2] = "",
         inputHolder[3] = "25, 50, 75",
         inputHolder[4] = "12.5",
         inputHolder[5] = "51",
         inputHolder[6] = "0",
         inputHolder[7] = "5",
         inputHolder[8] = "1000000",
         inputHolder[9] = "4",
         inputHolder[10] = "12"
       ]
     });


});

module.exports = router;

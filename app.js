var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var form = require('./routes/form');
var formerrors = require('./routes/formerrors');
var dataDisplay = require('./routes/dataDisplay');

var validator = require('express-validator');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// must declare use for any /etc extensions to local host
app.use('/', index);
app.use('/users', users);
app.use('/form', form);
app.use('/dataDisplay', dataDisplay);
//app.use('/formerrors', formerrors);

app.post('/form', urlencodedParser, function(req,res){
  // santize inputs
  req.sanitizeBody('first_name').escape();
  req.sanitizeBody('age').escape();
  req.sanitizeBody('gender').escape();

  // make server check input in order of priority
  req.checkBody("first_name", "Input a first name.").notEmpty();
  req.checkBody("first_name", "Invalid first name. First name can only contain letters.").isAlpha();
  req.checkBody("last_name", "Input a last name.").notEmpty();
  req.checkBody("last_name", "Invalid last name. Last name can only contain letters.").isAlpha();

  req.checkBody("age", "Input an age.").notEmpty();
  req.checkBody("age", "Invalid age.").isInt();
  req.checkBody("gender", "Select a gender.").notEmpty();

  var errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    let hasFirstNameError = false;
    let hasLastNameError = false;
    let hasAgeError = false;
    let hasGenderError = false;
    let errorsString = "";
    // chain errors, and maintain error priority
    for (let i = 0; i< errors.length; i++) {
      if(errors[i].param === "first_name" && !hasFirstNameError) {
        hasFirstNameError = true;
        errorsString += errors[i].msg + "\n";
      } else if (errors[i].param === "last_name" && !hasLastNameError) {
        hasLastNameError = true;
        errorsString += errors[i].msg + "\n";
      } else if(errors[i].param === "age" && !hasAgeError){
        hasAgeError = true;
        errorsString += errors[i].msg + "\n";
      } else if(errors[i].param === "gender" && !hasGenderError) {
        hasGenderError = true;
        errorsString += errors[i].msg + "\n";
      }
    }
     res.render('form', {title: "Form", allErrors: errorsString});
     return;
   } else {
//     res.render('form', {allErrors: "No problems detected."});
     console.log(req.body.first_name);
     res.render('dataDisplay', {entries: [req.body.first_name, req.body.last_name, req.body.age, req.body.gender]});
     return;
   }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

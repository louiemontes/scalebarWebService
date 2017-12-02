var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
      p Gender:
        span(class ="errors")   #{specificErrors[3]}
        p Male:
          input(type='radio', name='gender', value='Male')
        p Female:
          input(type='radio', name='gender', value='Female')
        p  Prefer not to answer:
          input(type='radio', name='gender', value='Prefer not answer')

*/
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
  console.log("Before sanitized " + req.body.first_name);
  req.sanitizeBody('first_name').escape();
  console.log("After sanitized " + req.body.first_name);

  req.sanitizeBody('last_name').escape();
  req.sanitizeBody('age').escape();
  req.sanitizeBody('gender').escape();
  // super important... unless you want cross scripting
  // buddy, that's an open text box.
  // * usually my personal go to for starting trouble on someone else's app *
  req.sanitizeBody('extent').escape();
  req.sanitizeBody('lon_major_ticks').escape();
  req.sanitizeBody('lon_minor_ticks').escape();
  // these others ones still need sanitizing... but less critical since <script> tags
  // cannot even be inserted with the HTML5 number type. still best practice to clean anyways
  // "but doc, I can eat it still from the floor, I dont see any hair or nails on this pork chop!"
  req.sanitizeBody('nnodes').escape();
  req.sanitizeBody('cliplat').escape();
  req.sanitizeBody('lat_tick_interval').escape();
  req.sanitizeBody('mapscale').escape();
  req.sanitizeBody('height').escape();
  //req.sanitizeBody('gender').escape();
  //req.sanitizeBody('gender').escape();


  // make server check input in order of priority
  req.checkBody("first_name", "Input a first name.").notEmpty();
  req.checkBody("first_name", "Invalid first name. First name can only contain letters.").isAlpha();
  req.checkBody("last_name", "Input a last name.").notEmpty();
  req.checkBody("last_name", "Invalid last name. Last name can only contain letters.").isAlpha();

  // age checks
  req.checkBody("age", "Input an age.").notEmpty();
  req.checkBody("age", "Invalid age.").isInt();

  // the controversial check
  req.checkBody("gender", "Select a gender.").notEmpty();

  // no check for the optional string field.. but it was sanitized so no worry

  // jay's checks for scalebar
  req.checkBody("lon_major_ticks", "Input Longtitude Major Ticks value(s).").notEmpty();

  req.checkBody("lon_minor_ticks", "Input Longtitude Minor Ticks value(s).").notEmpty();

  req.checkBody("nnodes", "Input a Number of Nodes value.").notEmpty();
  req.checkBody("nnodes", "A Number Of Nodes input value must be an integer.").isInt();

  req.checkBody("cliplat", "Input a Clip Latitude At value.").notEmpty();

  req.checkBody("lat_tick_interval", "Input a Latitude Tick Interval value.").notEmpty();

  req.checkBody("mapscale", "Input a Mapscale denominator value.").notEmpty();
  req.checkBody("mapscale", "A Mapscale value must be an integer.").isInt();

  req.checkBody("height", "Input a value for Height.").notEmpty();


  var errors = req.validationErrors();
  let errorHolder = [];
  for (let i=0; i < 8; i++) {
    errorHolder[i] = "";
  }
  let errorsString = "";


  //
  //console.log(errors);
  if (errors) {
    let hasFirstNameError = false;
    let hasLastNameError = false;
    let hasAgeError = false;
    let hasGenderError = false;

    // new error possibilities for Jay
    let hasextentError = false;
    let haslon_major_ticksError = false;
    let haslon_minor_ticksError= false;
    let hasnnodesError = false;
    let hascliplatError = false;
    let haslat_tick_intervalError = false;
    let hasmapscaleError = false;
    let hasheightError = false;

    // chain errors, and maintain error priority
    for (let i = 0; i< errors.length; i++) {
      if(errors[i].param === "first_name" && !hasFirstNameError) {
        hasFirstNameError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[0] = errors[i].msg;
      } else if (errors[i].param === "last_name" && !hasLastNameError) {
        hasLastNameError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[1] = errors[i].msg;
      } else if(errors[i].param === "age" && !hasAgeError){
        hasAgeError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[2] = errors[i].msg;

      } else if(errors[i].param === "gender" && !hasGenderError) {
        hasGenderError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[3] = errors[i].msg;

      } else if(errors[i].param === "lon_major_ticks" && !haslon_major_ticksError) {
        haslon_major_ticksError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[4] = errors[i].msg;

      } else if(errors[i].param === "lon_minor_ticks" && !haslon_minor_ticksError) {
        haslon_major_ticksError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[5] = errors[i].msg;

      } else if(errors[i].param === "nnodes" && !hasnnodesError) {
        hasnnodesError= true;
        errorsString += errors[i].msg + "\n";
        errorHolder[6] = errors[i].msg;

      } else if(errors[i].param === "cliplat" && !hascliplatError) {
        hascliplatError= true;
        errorsString += errors[i].msg + "\n";
        errorHolder[7] = errors[i].msg;

      } else if(errors[i].param === "lat_tick_interval" && !haslat_tick_intervalError) {
        haslat_tick_intervalError= true;
        errorsString += errors[i].msg + "\n";
        errorHolder[8] = errors[i].msg;

      } else if(errors[i].param === "mapscale" && !hasmapscaleError) {
        hasmapscaleError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[9] = errors[i].msg;

      } else if(errors[i].param === "height" && !hasheightError) {
        hasheightError = true;
        errorsString += errors[i].msg + "\n";
        errorHolder[10] = errors[i].msg;

      }
    }
     res.render('form', {
       title: "Form",
       specificErrors: errorHolder
     });


     console.log("errorHolder: " + errorHolder[0]);
     console.log("First Name: " + req.body.first_name);
     console.log("Last Name (unsantized): " + req.body.first_name);

     return;
   } else {
    entryHolder = [
      req.body.first_name,
      req.body.last_name,
      req.body.age,
      req.body.gender,
      req.body.lon_major_ticks,
      req.body.lon_minor_ticks,
      req.body.nnodes,
      req.body.cliplat,
      req.body.lat_tick_interval,
      req.body.mapscale,
      req.body.height
    ]
     res.render("dataDisplay", {entries: entryHolder});

     // soon will move string "number arrays" to actual number arrays
     // req.body.lon_major_ticks = decipherArraysFromStrings(req.body.lon_major_ticks)
     // req.body.lon_minor_ticks = decipherArraysFromStrigns(req.body.lon_minor_ticks);
     ///res.send({entries: [req.body]});
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

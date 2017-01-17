var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

var mongojs = require('mongojs');
var logindb = mongojs('contactlist',['contactlist']);

//Init App
var app = express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave: true
}));
//Passport init 
app.use(passport.initialize());
app.use(passport.session()); 

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});




app.use('/',routes);
app.use('/users', users);

//Set Port
app.set('port',(process.env.PORT || 8888));

app.listen(app.get('port'), function(){
	console.log('Server started on port'+app.get('port'));
})


app.get('/contactlist',
  function(req, res) {
	console.log("I received a GET request")

	/* person1 = {
        name: 'Tim',
        email: 'tim@gmail.com',
        number:'(571) 426-1433'
    };

    person2 = {
        name:'Liam',
        email:'neason@taken2.com',
        number: '(777) 777-7777'
    };

    person3={
        name: 'Jessie',
        email:'jessie@vma.com',
        number: '(684) 426-1232'
    };

var contactlist = [person1, person2, person3];
res.json(contactlist);*/
	
	logindb.contactlist.find(function(err,docs){
				console.log(docs);
				res.json(docs);
	});

});

app.post('/contactlist',function(req,res){
		console.log(req.body);
		logindb.contactlist.insert(req.body,function(err,doc){
			res.json(doc);
		});
});

app.delete('/contactlist/:id',function(req,res){
	var id=req.params.id;
	console.log(id);
	logindb.contactlist.remove({_id:mongojs.ObjectId(id)},function(err,doc) {
		res.json(doc);
	})
});


app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  logindb.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  logindb.contactlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});
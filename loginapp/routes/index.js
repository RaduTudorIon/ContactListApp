var express = require('express');
var router = express.Router();

//Get homepage
router.get('/',ensureAuthenticated, function(req,res){
	res.render('index');
});

function ensureAuthenticated(req,res,next)//pentru a nu putea accesa pagina de dashboard dupa logout 
{
	if(req.isAuthenticated()){
		return next();
	} else{
		req.flash('error','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;
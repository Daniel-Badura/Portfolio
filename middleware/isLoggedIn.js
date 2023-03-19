//jshint esversion:10
module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()){
        req.flash('error', 'Aby wykonać tą akcję, musisz być zalogowany');
        res.cookie('returnAfterLogin', req.originalUrl);
        return res.redirect('/login');
    }   
    next();
};


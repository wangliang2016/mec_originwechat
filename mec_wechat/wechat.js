var wechat      = require('wechat');
var path        = require('path');
var express     = require('express');
var bodyParser      = require('body-parser');
var cookieParser =require('cookie-parser');
var session =require('express-session');
var ejs     =require('ejs');
var app         = express();
var mainRoutes          = require('./routes/main');
var gamesRoutes          = require('./routes/games');
var gameTemplateRoutes          = require('./routes/gameTemplate');
var couponRoutes          = require('./routes/coupon');
var activityRoutes          = require('./routes/activity');

//视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));


//app.use(session({
//    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
//    cookie: { maxAge: 60 * 1000 }
//}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use('/', mainRoutes);
app.use('/gametemplate', gameTemplateRoutes);
app.use('/games', gamesRoutes);
app.use('/coupon', couponRoutes);
app.use('/activity', activityRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports=app;
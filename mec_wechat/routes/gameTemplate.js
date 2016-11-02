var express             = require('express');
var path                =require('path');
var url                =require('url');
var fs                =require('fs');
var qstring         =require('querystring');
var async           =require('async');
var router              = express.Router();
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';

router.get('/bigwheel',function(req,res){
    res.render('gameTemplate/bigWheel');
});

router.get('/',function(req,res){
    res.render('gameTemplate/bigWheel');
});
module.exports = router;
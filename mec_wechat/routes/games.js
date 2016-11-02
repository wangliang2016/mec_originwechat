var express             = require('express');
var path                =require('path');
var url                =require('url');
var fs                =require('fs');
var qstring         =require('querystring');
var async           =require('async');
var formidable = require('formidable');
var router              = express.Router();
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
var gameService        =require('../service/gameService');
var myLogger            = require('../logging/contextLogger')("game");

router.get('/allgames',function(req,res){
    res.render('games/allGames');
});

router.get("/getAllGame",function(req,res){
    var queryCondition=null;
    gameService.getGameAll(queryCondition,function(err,msg){
        if(!err&&msg){
            var originData=[];
            originData=msg;
            myLogger.trace("post [/viewOne]: "+JSON.stringify(originData));
            res.send(JSON.stringify(originData));
        }
    })
});

router.get('/gameSetting*',function(req,res){
    res.render('games/'+req.url);
});

router.get('/gamebegin*',function(req,res){
    res.render('games/'+req.url);
});

router.post('/uploadImg', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/upload';
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        var image = files.imgFile;
        var path = image.path;
        path = path.replace('/\\/g', '/');
        var url = '/upload/' + path.substr(path.lastIndexOf('\\')+1, path.length-1);
        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });
});

router.post('/queryRelativeActivity',function(req,res){
    var postParams=req.body;
    var queryWord=postParams.queryword;

});
module.exports = router;
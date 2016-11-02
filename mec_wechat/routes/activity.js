var express             = require('express');
var path                =require('path');
var url                =require('url');
var fs                =require('fs');
var qstring         =require('querystring');
var async           =require('async');
var formidable = require('formidable');
var router              = express.Router();
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
var activityService        =require('../service/activityService');
//var game1Service        =require('../service/game1Service');
var myLogger            = require('../logging/contextLogger')("activity");

router.post('/addOneActivity',function(req,res){
    var postParams=req.body;
    console.log(postParams);
    var activityInfo=postParams.activityInfo;
    //增加session之后需要修改usercode
    var userCode=1;
    var sum=0;
    for(var i=0;i<7;i++){
        var probability='PROBABILITY'+i;
        if(activityInfo[probability]!=null){
            sum+=activityInfo[probability];
        }
    }
    if(sum!=100){
        res.send("设置奖项的概率存在问题",null);
    }
    activityService.addActivity(activityInfo,userCode,function(err,msg){

    });
});
router.get('/addOneActivity',function(req,res){
    var postParams=req.body;
    var activityInfo=postParams.activityInfo;
    //增加session之后需要修改usercode
    var userCode=0;
    var sum=0;
    for(var i=0;i<7;i++){
        var probability='PROBABILITY'+i;
        if(activityInfo[probability]!=null){
            sum+=activityInfo[probability];
        }
    }
    if(sum!=100){
        res.send("设置奖项的概率存在问题",null);
    }
    activityService.addActivity(activityInfo,userCode,function(err,msg){

    });
});
module.exports = router;
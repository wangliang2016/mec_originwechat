var express        = require('express');
var fs              =require('fs');
var url              =require('url');
var http            =require('http');
var async           =require('async');
var exec            = require('child_process').exec;
var myLogger       = require('../logging/contextLogger')("gameService");
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
var WechatAPI = require('wechat-api');
var sequelize       = require('../dao/_sequelize');
var wechat_game1DAO=require("../dao/wechat_game1DAO");
var wechat_activityDAO=require("../dao/wechat_activityDAO");
var wechat_userDAO=require("../dao/wechat_userDAO");
var gameLibConfig=require('../config/gamelibConfig.json')[node_env];
var generalService        =require('../service/generalService');

exports.getRelativeActivity=function(queryCondition,cb){
    if(queryCondition==null){
        wechat_activityDAO.queryAll(function(err,msg){
        })
    }else{
        async.waterfall([
            function(icb){
                wechat_activityDAO.queryAll({where:{NAME:{$like:queryCondition}}},function(err,msg){
                    if(!err){
                          icb(null,msg);
                    }else{
                        icb(err,null);
                    }
                })
            }
            //function(icb){
            //    var date={
            //        "begin_date": "2014-12-08",
            //        "end_date": "2014-12-08"
            //    }
            //    var options = {
            //        method: 'post',
            //        url: reqUrl,
            //        body:JSON.stringify(menu)
            //    };
            //}
        ],function(err,msg){
            if(!err){
                cb(err,msg);
            }
        })
    }

}

exports.addActivity=function(activityInfo,userCode,cb){
    var gameCode=activityInfo.GAMECODE;
    activityInfo['USERCODE']=userCode;
    return sequelize.transaction({autocommit: false}).then(function (t) {
        async.waterfall([
            function(icb){
                wechat_userDAO.queryOne({where:{USERCODE:userCode}},function(err,msg){
                    if(!err&&msg){
                        icb(null,msg);
                    }else{
                        if(!err&&!msg){
                            icb("请重新登录",null);
                        }else{
                            icb(err,null);
                        }
                    }
                })
            },
            function (platformconfig,icb) {
                if (gameCode == 1) {
                    wechat_game1DAO.add(activityInfo,t, function (err, msg) {
                        if (!err && msg) {
                            icb(null, msg,platformconfig);
                        } else {
                            icb(err, null);
                        }
                    })
                }
            },
            function (gameInfo, platformconfig,icb) {
                var gameId = gameInfo.GAMEID;
                activityInfo['GAMEID'] = gameId;
                var gameInstanceId = generalService.getGameInstanceID(gameId);
                if (gameCode < 10) {
                    gameCode = '0' + gameCode;
                }
                activityInfo['GAMEADDRESS'] = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + platformconfig.appid + "&redirect_uri=" + gameLibConfig.hostUrl + "/game/maingame&response_type=code&scope=snsapi_userinfo&state=" + gameInstanceId + gameCode + "#wechat_redirect";
                console.log(activityInfo);
                wechat_activityDAO.add(activityInfo, t,function (err, msg) {
                    if (!err) {
                        icb(null, msg);
                    } else {
                        icb(err, null);
                    }
                });
            }
        ], function (err, msg) {
            if (!err) {
                cb(null, true);
                return t.commit();
            } else {
                console.log(err);
                cb(err,null);
                return t.rollback();
            }
        })
    });
}

var express        = require('express');
var crypto          =require('crypto');
var fs              =require('fs');
var url              =require('url');
var http            =require('http');
var exec            = require('child_process').exec;
var myLogger       = require('../logging/contextLogger')("genralService");
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';

exports.getGameInstanceID=function (gameId){
    gameId=gameId.toString();
    var template=[];
    template.push([15,14,3,2,1]);
    template.push([15,11,7,3,1]);
    template.push([15,12,8,4,1]);
    template.push([15,14,9,3,1]);
    template.push([15,14,3,2,1]);

    var templateValue=Math.ceil(Math.random()*4);
    var gameInstanceID=[];
    for(var u=0;u<15;u++){
        gameInstanceID[u]='*';
    }
    var ints = ['0','1','2','3','4','5','6','7','8','9','0'];
    var chars=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A'];
    gameInstanceID[0]=templateValue;
    //console.log(gameInstanceID);
    for(var i=0;i<5;i++){
        gameInstanceID[template[templateValue][i]]=ints[Math.ceil(Math.random()*10)];
    }
    //console.log(gameInstanceID.toString());
    var t=gameId.length-1;
    var j=15;
    for(;j>0;j--){
        if(t<0){
            break;
        }
        if(gameInstanceID[j]=='*'){
            gameInstanceID[j]=gameId[t];
            t--;
        }

    }
    for(;j>=0;j--){
        if(gameInstanceID[j]=='*'){
            gameInstanceID[j]=chars[Math.ceil(Math.random()*26)];
        }
    }
    var gameInstanceId="";
    for(var i=0;i<gameInstanceID.length;i++){
        gameInstanceId+=gameInstanceID[i];
    }
    return gameInstanceId;
}
exports.parseGameInstanceId=function(gameInstanceId){
    var gameInstanceID=[];
    for(var j=0;j<gameInstanceId.length;j++){
        gameInstanceID.push(gameInstanceId.charAt(j));
    }
    var template=[];
    template.push([15,14,3,2,1]);
    template.push([15,11,7,3,1]);
    template.push([15,12,8,4,1]);
    template.push([15,14,9,3,1]);
    template.push([15,14,3,2,1]);
    var value=gameInstanceID[0];
    gameInstanceID[0]='A';
    for(var i=0;i<5;i++){
        gameInstanceID[template[value][i]]='A';
    }
    var gameInstanceIDString=gameInstanceID.toString();
    var tmp="";
    for(var t=0;t<gameInstanceIDString.length-1;t++){
        if(48<=gameInstanceIDString.charCodeAt(t)&&gameInstanceIDString.charCodeAt(t)<=57){
            tmp+=gameInstanceIDString[t];
        }
    }
    var produceId=parseInt(tmp);
    return produceId;
}
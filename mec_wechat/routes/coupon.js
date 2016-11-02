var express             = require('express');
var path                =require('path');
var url                =require('url');
var fs                =require('fs');
var qstring         =require('querystring');
var async           =require('async');
var formidable = require('formidable');
var router              = express.Router();
var node_env=process.env.NODE_ENV ? process.env.NODE_ENV:'dev';
var couponConfig=require('../config/couponConfig.json')[node_env];
var myLogger            = require('../logging/contextLogger')("cooupon");
var httpsUtil     =require('../interaction/httpsRequest');
var securityService     =require('../security/securityService');

router.get('/getEffectiveCouponTemplate',function(req,res){
    //此处要修改，登录之后merchantcode会直接知道
    var date=new Date();
    var data= {
        attributes: [
            'templateid',
            'templatecode',
            'merchantcode',
            'templatecontent'
        ],
        condition: {
            dateexpires:{
                comp:3,
                date:date
            },
            usescope: false
        },
        merchantcode:'20020',
        sign_type:"RSA-SHA1"
    };
    var sign_type="RSA-SHA1";
    var key=fs.readFileSync('../security/keys/client.key').toString('ascii');
    var sig=securityService.getSign(key,sign_type,data);
    data['sign']=sig;
    //console.log(JSON.stringify(data));
    var data=JSON.stringify(data);
    var options = {
        hostname: couponConfig.hostname,
        port: couponConfig.port,
        path: '/coupontemplate/querycoupontemplate',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        },
        method: 'POST',
        post_data:data
    };

    httpsUtil(options,function(err,msg){
        if(!err){
            //需要验证发送该消息的正确性
            res.send({'status':true,'msg':msg});
        }else{
            res.send({'status':false,'msg':err})
        }
    })

});
module.exports = router;
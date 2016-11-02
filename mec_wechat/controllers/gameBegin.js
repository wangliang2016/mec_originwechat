var mymodule=angular.module('ews',[]);
mymodule.controller('gamebegincontrl',['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    $scope.addActivityPage=function(settingnum){
        window.location.href="../games/gameSetting"+settingnum;
    }
}]);
mymodule.controller('gamebegincontrl1',['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    $scope.queryActivityInfo=function(){
        $http({
            url:'games/queryRelativeActivity',
            method:"POST",
            headers: {
                'Content-Type': "application/json;charset=UTF-8"
            },
            data:{queryword:$scope.queryActivityName}
        })
            .success(function(data){
                if(data){
                    $scope.activityInfos=msg;
                }
            })
    };
    $scope.addActivityPage=function(settingnum){
        window.location.href="./games/gameSetting"+settingnum;
    }
}]);
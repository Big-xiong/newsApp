;
(function() {
    var routes = angular.module('routes', []);
    routes.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
        // 一层路由
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'template/home.html'
        })
        // 二层路由
        .state('home.video', {
            url: '/video',
            templateUrl: 'template/video.html'
        }).state('home.index', {
            url: '/index/:tableNum',
            templateUrl: 'template/index.html'
        }).state('home.weitoutiao', {
            url: '/weitoutiao',
            templateUrl: 'template/weitoutiao.html'
        }).state('home.mine', {
            url: '/mine',
            templateUrl: 'template/mine.html'
        })
        // home三层路由
        .state('home.weitoutiao.toutiao', {
            url: '/toutiao/:tableNum',
            templateUrl: 'template/toutiao.html'
        }).state('home.weitoutiao.yule', {
            url: '/yule/:tableNum',
            templateUrl: 'template/yule.html'
        }).state('home.weitoutiao.junshi', {
            url: '/junshi/:tableNum',
            templateUrl: 'template/junshi.html'
        }).state('home.weitoutiao.qiche', {
            url: '/qiche/:tableNum',
            templateUrl: 'template/qiche.html'
        }).state('home.weitoutiao.caijing', {
            url: '/caijing/:tableNum',
            templateUrl: 'template/caijing.html'
        }).state('home.weitoutiao.xiaohua', {
            url: '/xiaohua/:tableNum',
            templateUrl: 'template/xiaohua.html'
        }).state('home.weitoutiao.tiyu', {
            url: '/tiyu/:tableNum',
            templateUrl: 'template/tiyu.html'
        }).state('home.weitoutiao.keji', {
            url: '/keji/:tableNum',
            templateUrl: 'template/keji.html'
        })
        // mine三层路由
        .state('home.mine.dongtai', {
            url: '/dongtai',
            templateUrl: 'template/dongtai.html'
        }).state('home.mine.shoucang', {
            url: '/shoucang',
            templateUrl: 'template/shoucang.html'
        }).state('home.mine.xiaoxi', {
            url: '/xiaoxi',
            templateUrl: 'template/xiaoxi.html'
        })

        // 详情页路由
        .state('detail', {
            url: '/detail/:id/:tableNum',
            templateUrl: 'template/detail.html'
        })
        $urlRouterProvider.when('','/home/index/1');
    }]);
})();

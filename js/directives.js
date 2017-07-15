; // 避免出现全局变量
(function() {
    var directives = angular.module('directives', []);
    directives.directive('xheader', ['$state', function($state) {
        return {
            templateUrl: 'directive/xheader.html',
            link: function(scope, ele, attr) {
                scope.columnArr = ['#!/home/index', '#!/home/weitoutiao/yule/2', '#!/home/weitoutiao/junshi/3', '#!/home/weitoutiao/qiche/4', '#!/home/weitoutiao/caijing/5', '#!/home/weitoutiao/xiaohua/6', '#!/home/weitoutiao/tiyu/7', '#!/home/weitoutiao/keji/8']
                scope.tableNum = $state.params.tableNum;
                scope.route = scope.columnArr[scope.tableNum - 1];
                scope.title = attr.channel;
                //console.log(scope.title);
            }
        }
    }]);
    directives.directive('xsearch', [function() {
        return {
            templateUrl: 'directive/xsearch.html',
            link:function(scope,ele,attr){
                scope.isShowSearch = false;
                scope.keyword='';
                scope.changeShowSearch = function(){
                    scope.isShowSearch = true;
                }
                scope.clearWord = function(){
                    scope.keyword = '';
                }
            }
        }
    }]);
    directives.directive('xbanner', ['$http',"$timeout", function($http,$timeout) {
        return {
            templateUrl: 'directive/xbanner.html',
            link: function(scope, ele, attr) {
                scope.banner = [];
                scope.tablenum = 1;
                scope.page = 2;
                scope.pageSize = 4;
                scope.isShow = 0;
                scope.showImg = function(){
                    scope.isShow++;
                    $timeout(function(){
                        $http({
                            method: 'GET',
                            url: 'http://localhost:6789/',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                            },
                            params: {
                                tableNum: scope.tablenum,
                                page: scope.page,
                                pagesize: scope.pageSize
                            },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj) {
                                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                                }
                                return str.join("&");
                            }
                        }).then(function(data) {
                            console.log(data.data.data);
                            scope.banner = data.data.data;
                            scope.isShow--;
                            if(scope.isShow != 0){
                                scope.isShow = 0;
                            }
                            console.log(scope.isShow);

                        }, function(err) {
                            console.log(err);
                        });
                    },1000)
                }
                scope.showImg();
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true //修改swiper的父元素时，自动初始化swiper
                });
            }
        }
    }]);
    directives.directive('xlist', ['$http', function($http) {
        return {
            templateUrl: 'directive/xlist.html',
            link: function(scope, ele, attr) {
                scope.news = [];
                scope.channel = attr.channel;
                scope.tableNum = 1;
                scope.page = 1;
                scope.pagesize = 10;
                scope.noMore = false;
                scope.showMore = true;
                scope.changeShow = function() {
                    scope.showNews();
                }
                scope.showNews = function() {
                    scope.isShow++;
                    scope.showMore = false;
                    $http({
                        method: 'GET',
                        url: 'http://localhost:6789/',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        params: {
                            tableNum: scope.tableNum,
                            page: scope.page++,
                            pagesize: scope.pagesize
                        },
                        transformRequest: function(obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }).then(function(data) {
                        console.log(data.data.data);
                        scope.news = scope.news.concat(data.data.data);
                        scope.isShow--;
                        scope.showMore = true;
                        if (scope.news.length >= 50) {
                            scope.noMore = true;
                            scope.isShow=0;
                            scope.showMore = false;
                        }
                    }, function(err) {
                        console.log(err);
                    });
                }
                scope.showNews();
            }
        }
    }]);
    directives.directive('xfooter', ['$location', function($location) {
        return {
            templateUrl: 'directive/xfooter.html',
            link: function(scope, ele, attr) {
                var urlObj = $location.path().split('/');
                scope.route = urlObj[2];
                // 根据路由来判断每次刷新是显示在哪个column
                scope.currentCol = function() {
                    if (scope.route == 'index') {
                        scope.tab = 0;
                        scope.changeTab = function(tab) {
                            scope.tab = tab;
                        }
                    } else if (scope.route == 'weitoutiao') {
                        scope.tab = 2;
                        scope.changeTab = function(tab) {
                            scope.tab = tab;
                        }
                    } else if (scope.route == 'mine') {
                        scope.tab = 3;
                        scope.changeTab = function(tab) {
                            scope.tab = tab;
                        }
                    }
                }
                scope.currentCol();
            }
        }
    }]);
    directives.directive('xarticle', ['$state', '$http', function($state, $http) {
        return {
            templateUrl: 'directive/xarticle.html',
            // controller:function(){
            //     $rootScope.toXgallery=function(){
                     
            //     }
            // }
            link: function(scope, ele, attr) {
                console.log($state);
                scope.news_id = $state.params.id;
                scope.channel = attr.channel;
                scope.tableNum = $state.params.tableNum;
                scope.news = {};
                scope.showNewsImg = false;
                scope.click = function(e){
                    scope.imgUrl = e.target.src;
                    scope.showNewsImg = true;
                }
                scope.changeGallery = function(){
                    scope.showNewsImg = false;
                }
                $http({
                    method: 'GET',
                    url: 'http://localhost:6788/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    params: {
                        tableNum: scope.tableNum,
                        id: scope.news_id
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).then(function(data) {
                    console.log(data.data.data);
                    scope.news = data.data.data;
                }, function(err) {
                    console.log(err);
                });
            }
        }
    }]);
    directives.directive('xcolumn', ['$state', function($state) {
        return {
            templateUrl: 'directive/xcolumn.html',
            link: function(scope, ele, attr) {
                scope.tableNum = $state.params.tableNum;
                scope.changeColumn = function(num) {
                    scope.tableNum = num;
                }
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 8,
                    paginationClickable: true,
                    spaceBetween: 10,
                    freeMode: true
                });
            }
        }
    }]);
    directives.directive('xloading', [function() {
        return {
            templateUrl: 'directive/xloading.html'
        }
    }]);


    // 组件的命名中不能有大写
    directives.directive('xcolumnnews', ['$http', '$state', function($http, $state) {
        return {
            templateUrl: 'directive/xcolumnnews.html',
            link: function(scope, ele, attr) {
                scope.channel = attr.channel;
                console.log(scope.channel);
                scope.news = [];
                scope.tableNum = $state.params.tableNum;
                scope.page = 1;
                scope.pagesize = 10;
                scope.isShow = true;
                scope.noMore = false;
                scope.showMore = true;
                scope.changeShow = function() {
                    scope.isShow = true;
                    scope.showMore = false;
                    scope.showNews();
                }
                scope.showNews = function() {
                    $http({
                        method: 'GET',
                        url: 'http://localhost:6789/',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        params: {
                            tableNum: scope.tableNum,
                            page: scope.page++,
                            pagesize: scope.pagesize
                        },
                        transformRequest: function(obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }).then(function(data) {
                        console.log(data.data.data);
                        scope.news = scope.news.concat(data.data.data);
                        scope.isShow = false;
                        scope.showMore = true;
                        if (scope.news.length >= 50) {
                            scope.noMore = true;
                            scope.isShow = false;
                            scope.showMore = false;
                        }
                    }, function(err) {
                        console.log(err);
                    });
                }
                scope.showNews();
            }
        }
    }]);
})();

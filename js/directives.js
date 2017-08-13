; // 避免出现全局变量
(function() {
    var directives = angular.module('directives', []);
    directives.directive('xheader', ['$state', function($state) {
        return {
            templateUrl: 'directive/xheader.html',
            link: function(scope, ele, attr) {
                scope.baseUrl = "https://bird.ioliu.cn/v1?url=";
                scope.columnArr = ['#!/home/index/1', '#!/home/weitoutiao/yule/2', '#!/home/weitoutiao/junshi/3', '#!/home/weitoutiao/qiche/4', '#!/home/weitoutiao/caijing/5', '#!/home/weitoutiao/xiaohua/6', '#!/home/weitoutiao/tiyu/7', '#!/home/weitoutiao/keji/8']
                scope.tableNum = $state.params.tableNum;
                scope.route = scope.columnArr[scope.tableNum - 1];
                scope.title = attr.channel;
                // console.log(scope.tableNum);
                //console.log(scope.title);
            }
        }
    }]);
    directives.directive('xsearch', [function() {
        return {
            templateUrl: 'directive/xsearch.html',
            link: function(scope, ele, attr) {
                scope.isShowSearch = false;
                scope.keyword = '';
                scope.changeShowSearch = function() {
                    scope.isShowSearch = true;
                }
                scope.clearWord = function() {
                    scope.keyword = '';
                }
            }
        }
    }]);
    directives.directive('xbanner', ['$http', "$timeout", function($http, $timeout) {
        return {
            templateUrl: 'directive/xbanner.html',
            link: function(scope, ele, attr) {
                scope.banner = [];
                scope.tablenum1 = 1;
                scope.page1 = 2;
                scope.pageSize1 = 4;
                scope.isShow = 0;
                scope.showImg = function() {
                    scope.isShow++;
                    $timeout(function() {
                        $http({
                            method: 'GET',
                            url: scope.baseUrl + "http://api.dagoogle.cn/news/get-news?tableNum=" + scope.tablenum1 + "&pagesize=" + scope.pageSize1 + "&page=" + scope.page1,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                            },
                            transformRequest: function(obj) {
                                var str = [];
                                for (var p in obj) {
                                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                                }
                                return str.join("&");
                            }
                        }).then(function(data) {
                            // console.log(data.data.data);
                            scope.banner = data.data.data;
                            scope.isShow--;
                            if (scope.isShow != 0) {
                                scope.isShow = 0;
                            }
                            // console.log(scope.isShow);

                        }, function(err) {
                            console.log(err);
                        });
                    }, 1000)
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
                scope.tableNum1 = 1;
                scope.page1 = 1;
                scope.pagesize1 = 10;
                scope.noMore = false;
                scope.showMore = true;
                scope.changeShow = function() {
                    scope.showNews();
                }
                scope.showNews = function() {
                    scope.isShow++;
                    scope.showMore = false;
                    scope.page1++;
                    $http({
                        method: 'GET',
                        url: scope.baseUrl + "http://api.dagoogle.cn/news/get-news?tableNum=" + scope.tableNum1 + "&pagesize=" + scope.pagesize1 + "&page=" + scope.page1,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        /*params: {
                            tableNum: scope.tableNum,
                            page: scope.page++,
                            pagesize: scope.pagesize
                        },*/
                        transformRequest: function(obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }).then(function(data) {
                        // console.log(data.data.data);
                        scope.news = scope.news.concat(data.data.data);
                        scope.isShow--;
                        scope.showMore = true;
                        if (scope.news.length >= 50) {
                            scope.noMore = true;
                            scope.isShow = 0;
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
                // console.log($state);
                scope.news_id = $state.params.id;
                scope.channel = attr.channel;
                scope.tableNum2 = $state.params.tableNum;
                scope.news = {};
                scope.showNewsImg = false;
                scope.mainContent = '';
                scope.commentArr = [];
                scope.isShou = false;
                scope.dongtai = getCookie('dongtai') ? JSON.parse(getCookie('dongtai')) : [];
                scope.hadshou = function() {
                    var now = Date.parse(new Date());
                    scope.isShou = !scope.isShou;
                    if (!getCookie('dongtai')) {
                        var dongtaiObj = {
                            title: scope.news.title,
                            imgurl: scope.news.top_image,
                            time: now
                        }
                        scope.dongtai.push(dongtaiObj);
                        setCookie("dongtai", JSON.stringify(scope.dongtai));
                    } else {
                        var dongtaiObj = {
                            title: scope.news.title,
                            imgurl: scope.news.top_image,
                            time: now
                        }
                        scope.dongtai.push(dongtaiObj);
                        setCookie("dongtai", JSON.stringify(scope.dongtai));
                    }
                }
                scope.click = function(e) {
                    scope.imgUrl = e.target.src;
                    scope.showNewsImg = true;
                }
                scope.changeGallery = function() {
                    scope.showNewsImg = false;
                }
                scope.sendComment = function() {
                    //document.getElementsByClassName('.newComment')[0];
                    var now = Date.parse(new Date());
                    var obj = {}
                    obj.content = scope.mainContent;
                    obj.time = now;
                    scope.commentArr.push(obj);
                    if (!getCookie('dongtai')) {
                        console.log(222);
                        var dongtaiObj = {
                            title: scope.news.title,
                            content: scope.mainContent,
                            time: now
                        }
                        scope.dongtai.push(dongtaiObj);
                        setCookie("dongtai", JSON.stringify(scope.dongtai));
                    } else {
                        var dongtaiObj = {
                            title: scope.news.title,
                            content: scope.mainContent,
                            time: now
                        }
                        scope.dongtai.push(dongtaiObj);
                        setCookie("dongtai", JSON.stringify(scope.dongtai));
                    }
                    scope.mainContent = '';
                }
                scope.detail = function() {
                    $http({
                        method: 'GET',
                        url: scope.baseUrl + "http://api.dagoogle.cn/news/single-news?tableNum=" + scope.tableNum2 + "&news_id=" + scope.news_id,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        transformRequest: function(obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }).then(function(data) {
                        // console.log(data.data.data);
                        scope.news = data.data.data;
                    }, function(err) {
                        console.log(err);
                    });
                }
                scope.detail();
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
                scope.baseUrl = "https://bird.ioliu.cn/v1?url=";
                scope.channel = attr.channel;
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
                        url: scope.baseUrl + "http://api.dagoogle.cn/news/get-news?tableNum=" + scope.tableNum + "&pagesize=" + scope.pagesize + "&page=" + scope.page,
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
    directives.directive('xmine', ['$state', function($state) {
        return {
            templateUrl: 'directive/xmine.html',
            link: function(scope, ele, attr) {
                scope.num = 1;
                scope.changeColumn = function(num) {
                    scope.num = num;
                }
            }
        }
    }]);
    directives.directive('xdongtai', ['$state', function($state) {
        return {
            templateUrl: 'directive/xdongtai.html',
            link: function(scope, ele, attr) {
                scope.dongtai = null;
                scope.showNo = false;
                scope.tag = ['收藏文章','发表评论']
                scope.render = function() {
                    scope.dongtai = getCookie('dongtai') ? JSON.parse(getCookie('dongtai')) : []
                    console.log(scope.dongtai);
                    if(scope.dongtai.length == 0){
                        // console.log(111);
                        scope.showNo = true;
                    }else{
                        scope.showNo = false;
                    }
                }
                scope.render();
            }
        }
    }]);
    directives.directive('xshoucang', ['$state', function($state) {
        return {
            templateUrl: 'directive/xshoucang.html',
            link: function(scope, ele, attr) {

            }
        }
    }]);
    directives.directive('xxiaoxi', ['$state', function($state) {
        return {
            templateUrl: 'directive/xxiaoxi.html',
            link: function(scope, ele, attr) {

            }
        }
    }]);
})();

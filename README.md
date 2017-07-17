# Angular1x MVC框架
自己从项目中获取的经验，欢迎大家提意见，相互学习，在用angular写项目的时候，通常会将controller,directive,filter,service,route分别定义成相应的模块，分成5个js文件来写，方便我们进行维护,
[查看官方文档](https://docs.angularjs.org/api)

## angular基础

|控制器|指令/组件|过滤器|服务|路由|脏检测机制|双向数据绑定|依赖注入|表达式|
|-|-|-|-|-|-|-|-|-|
|controller|directive|filter|service|route|dirty check|data binding|dependency injection|{{}}在指令中不需要使用，指令中的变量直接写，加单引号则表示字符|

### 控制器

```javascript
var app = angular.module('ngApp',['ui.router']);
// 通过$state来传参
app.controller('detailCtrl',function($state){
     console.log($state);
});
```
一个程序只需要一个控制器就好了，需要注意$scope只能注入控制器中，其他任何地方都没法注入$scope，采用组件化开发的时候，可以完全抛弃使用控制器，因为在link:function(scope,ele,attr)中，可以通过scope来定义自己的方法

### 指令
#### 常用的内置指令

|常用的控制器|用法|注意|
|-|-|-|
|ng-init|ng-init="value"|主要用来初始化数据，给控制添加初始值|
|ng-app|ng-app="模块名"|用来声明主模块，一般一个网站或者app一个主模块就够了|
|ng-controller|ng-controller="控制器名"|声明一个控制器的作用域，一个主模块中可以有多个控制器，一般来说有一个控制器也就可以了|
|ng-click|ng-click="click()" 绑定一个自定义的函数，点击的时候执行这个函数|如果是事件委托时，需要在函数中传入$event，在自定义的函数中可以打印出e.target,再根据e.target来获取元素的属性，并操作节点的属性|
|ng-bind|ng-bind="value" value可以为变量，也可以为字符串，数字，但不能为html结构|当为变量的时候，可以与ng-model中的变量进行绑定，达到双向数据绑定|
|ng-bind-html|ng-bind-html="value|html" value为一段html结构,通常配合自定义的html过滤器一起使用，防止跨域攻击|通过$sce.trustAsHtml(input)将html结构转成安全的html结构|
|ng-repeat|ng-repeat="n in news" news为一个数组，n为数组中的项|通过$http向后端获取数据后，使用ng-repeat遍历数组，将数组中的每一项遍历到html结构中，渲染到页面，通常n为对象，如果出现报错，通常是要加上"n in news track by $index",这是angular会识别到相同的数据，而无法遍历，$index就相当与创建了一个组件，具有唯一性,遍历的时候，可以通过$index来获取节点的索引值|
|ng-class/ng-style|ng-class="{object}" object为属性名：布尔值的一对名值对，如果为true,则该节点拥有这个类，否则没有|object中的布尔值可以根据是否为自定义模板的名字，使不同组件拥有不同的模版,可以添加多个名值对|
|ng-src|ng-src="value" value可以为一个真实路径，也可以为一个变量，或者字符串与变量的拼接，抑或是一个三元运算||
|ng-href|ng-href="同上"|```<a href="#!/detail/{{n.news_id}}/{{tableNum}}" class="weui-media-box weui-media-box_appmsg">```根据路由来拼接进到不同的页面|
|ng-model|ng-model="value" 通常是一个变量，可以为数字，字符串|这是angular中非常重要的一个指令与input,textarea和select标签一起使用，实现angular的双向数据绑定|
|ng-if|ng-if="value" value可以为布尔值，也可以是一个三元运算，只要最后得到的为布尔值就可以，如果为true则删除整个节点|这个指令也可以用来diy组件的模版，根据自定义的模板名字，通常我会用channel来写模版的名字|
|ng-show|ng-show="同上" 为true则显示节点，否则隐藏节点，不会删除节点|也可用来diy组将模板|
|ng-hide|ng-hide="同上" 作用与ng-show相反|也可用来diy组件模版|
|ng-transclude|ng-transclude="value" value为bool值，当为true时，则嵌入某段html结构|

#### 自定义指令/组件
- 自定义指令的写法
```javascript
app.directive('ngColor',function(){
     return {
          link:function(scope,ele,attr){
               ele.css('color',attr.ngColor);
          }
     }
});
```
通常自定义的指令只会用到link，通过link来创建这个指令独有的方法，与节点绑定在一起，使节点拥有某个功能，例如滑动指令，ngTouch
- 自定义组件的写法：组件需要有html模版，组件自己的方法，关于组件之间的通信后面会有专门板块详细讲到
```javascript
app.directive('xheader',function(){
     return {
          restrict:'ECMA', E:元素， C：类， M：注释， A：属性
          replace:true/false, // 一般都用false，这个用来指示是否显示相应的html结构
          controller:function(){
              
          },  // 实现自己的控制域,实现diy组件模版
          templateUrl:'url', //将重复的html弄到一个html文件上，使得能够被复用，当html结构很庞大时，用这个方法会易于代码的维护
          template:`<div>用es6字符串模版写入相应的html结构</div>`,  // 要在外层包一个<div></div>
          transclude:true/false,   // 组件嵌入，在要嵌入的标签上加上ng-transclude,一般都为true,允许在html标签上嵌入新的标签，实现diy组件模版
          link:function(scope,ele,attr){
               scope.name  //可以获取到控制器的变量
               ele //可以使用angular内置的jQlite(jquery),使用jq的一些方法，这样实现的组件可以完全放弃C层控制器层
               ele.css('color',attr.color)  // 根据标签中的属性值，可以高度定制化组件
          }
      }
 });

```

### 过滤器
#### 常用内置过滤器

|过滤器|用法|注意|
|-|-|-|
|currency| currency:"￥" :3  如果有参数，则用:隔开，参数写在:后面|第一个参数代表金钱符号，美元用$，第二个参数表示精度，3指会保留3为小数|
|date|date: "yyyy/dd hh:mm:ss EEEE" y:年，M:月，d:日，h:时，m:分，s:秒|从后台获取到的事件格式可能会有:UTC时间/iso时间 UTC时间为一串数字，注意有毫秒跟秒的区别，iso时间格式为：2015-05-20TO3:56:16.887Z,可以通过es5方法date.parse()，转成我们熟悉的UTC时间再进行操作|
|uppercase/lowercase|uppercase 直接使用就可以了，没有参数|uppercase,将所有的字母变成大写，lowercase,将所有的字母变成小写|
|json|json 没有参数|转成json字符串|
|number|number:3 | 转成数字，参数是指几位数字写一个分隔|
|orderBy|orderBy:value:bool value表示一个变量，bool值为true时，将数据按一个顺序排列，当为false时，于true相反的顺序排列|用来做排序，同样要注意从后台获取的数据的类型，再进行相应的数据类型转换成想要的数据类型来排列,一般都是配合ng-repeat一起使用|
|filter|filter:{value:search} value指遍历对象的属性，search指输入框中输入的值，会根据输入的值去搜索，将对应的数据显示到页面上|用来做前端的搜索，正常是要搜索应该要需从后端去获取数据再写入页面，一般都是配合ng-repeat一起使用|
limitTo|limitTo:length:index length指数据的长度，index指从哪个位置开始|主要用来做简单的分页效果，一般都是配合ng-repeat一起使用|

#### 自定义过滤器
```javascript
var filters = angular.module('filters', []);
filters.filter('html', ['$sce',function($sce) {
   return function(input) {
       return $sce.trustAsHtml(input);
   }
}]); //将html转成可以被信任html结构
filters.filter('toNum', [function() {
   return function(input) {
       return (input+'000')*1;
   }
}]); //由于后台的获取的时间格式为字符串，将字符串转成数字
```
这是我在项目用到的自定义的过滤器，过滤器中的第一个参数表示过滤器的名字，['$sce',function($sce)]是避免在gulp压缩js文件时，将$sce简写掉，所以用数组的形式，让function去获取到前面的参数

### 服务
#### 内置服务

|内置服务|用法|
|-|-|
|$scope|angular核心，一切的数据都需要$scope，在组件中只需要通过scope来定义|
|$http|angular定义的ajax请求服务，关于传参的问题，后面会详细讲到|
|$rootScope|用来定义全局变量，不同于$scope，定义的变量可以注入到其他的控制器或过滤器| 
|$sce|安全服务|
|$location|通过这个服务可以获取到url上的路由值|
|$timeout/$interval|angular里面的延时器和定时器$timeout(function(){},1000)|
|$window||
|$document|$document[0].getElementById("num").style.color = "green" 使用时要加上索引|

#### 自定义服务
```javascript
//构造器 单例对象
app.service("tool", function() {
     this.add = function() {
          return a + b
     }
})
//工厂模式
app.factory("tool2", function() {
     return {
          add: function(a, b) {
               return a + b
          }
     }
})
app.provider("skill", function() {
     return {
          $get: function() {
               return {
                    name: "ps"
               }
          }
     }
});
// 通常的写法，里面可以写入自己封装的各种方法
app.service("tool", function() {
     return {
          add: function(a, b) {
               return a + b
          },
          getQueryString: function(name) {
               var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
               var r = window.location.search.substr(1).match(reg);
               if(r != null) return unescape(r[2]);
               return null;
          },
          setCookie: function(name, value) {
               var days = 10;
               var ex = new Date();
               ex.setTime(ex.getTime() + days * 24 * 60 * 60 * 1000);
               document.cookie = name + "=" + value + ";expires=" + ex;
          },
          getCookie: function(name) {
               var a;
               var reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
               if(a = document.cookie.match(reg)) {
                    return a[2];
               }

          }
     }
})
```
有以上四种方式可以自定义服务，不难发现第一种跟第四种都是通过service来封装服务，最常用的还是第四种，可以自己封装一些方法，使用的时候，注入tool,例如要使用setCookie方法，则tool.setCookie

### 路由
||平行路由|嵌套路由|
|-|-|-|
|引入文件|angular-route.js|angular-ui-router.js|
|服务|$rootProvider|$stateProvider|
|参数的获取|$routeParams|$state|
|重定向|.otherwise({redirectTo:'/index'})|$urlRouterProvider.when('','/index/a');|
- 平行路由写法
```javascript
routes.config(function($routeProvider){
     $routeProvider.when('/index',{
          controller:'indexCtrl',
          templateUrl:'index.html'
     }).when('/home',{
          controller:'homeCtrl',
          templateUrl:'home.html'
          // 通过路由来传参
     }).when('/detail/:id/:skill',{
          // M C 根据不同的控制器来diy每个模版
          controller:'detailCtrl',
          // v 生成统一的模版
          templateUrl:'detail.html'
     }).otherwise({
          redirectTo:'/index'
     })
});
```
- 嵌套路由写法(spa单页面应用程序)
```javascript
routes.config(function($stateProvider,$urlRouterProvider){
     // 刷新进入默认路由，显示默认页面
     $urlRouterProvider.when('','/index/a');
     $stateProvider.state('index',{
          url:'/index',
          templateUrl:'template/index.html'
     }).state('index.a',{
          url:'/a',
          template:'<a href="#!/detail/3/ps">这是热点信息</a>'  // 把要传的数据写在link上，通常是用ng-href
     }).state('index.b',{
          url:'/b',
          template:'<p>这是体育信息</p>'
     }).state('index.c',{
          url:'/c',
          template:'<p>这是政治信息</p>'
     }).state('index.d',{
          url:'/d',
          template:'<p>这是生活信息</p>'
     }).state('detail',{
          url:'/detail/:id/:skill',  // 通过路由来传参
          controller:'detailCtrl',
          templateUrl:'template/detail.html'
     })
});
```

## 常见一些问题
### $http传参
### 组件与组件之间的通信
### 组件中不同模版的DIY方法
### angular常见的API
### 事件委托

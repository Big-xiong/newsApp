# Angular
自己从项目中获取的经验，欢迎大家提意见，相互学习

## angular基础

|控制器|指令/组件|过滤器|服务|路由|
|-|-|-|-|-|
|controller|directive|filter|service|route|
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
|ng-repeat|ng-repeat="n in news" news为一个数组，n为数组中的项|通过$http向后端获取数据后，使用ng-repeat遍历数组，将数组中的每一项遍历到html结构中，渲染到页面，通常n为对象，如果出现报错，通常是要加上"n in news track by $index",这是angular会识别到相同的数据，而无法遍历，%index就相当与创建了一个组件，具有唯一性|
|ng-class|ng-class="{object}" object为属性名：布尔值的一对名值对，如果为true,则该节点拥有这个类，否则没有|object中的布尔值可以根据是否为自定义模板的名字，使不同组件拥有不同的模版,不知道是否可以添加多个名值对？？？|
|ng-src|ng-src="value" value可以为一个真实路径，也可以为一个变量，或者字符串与变量的拼接，抑或是一个三元运算||
|ng-href|ng-href="同上"|```<a href="#!/detail/{{n.news_id}}/{{tableNum}}" class="weui-media-box weui-media-box_appmsg">```根据路由来拼接进到不同的页面|
|ng-model|ng-model="value" 通常是一个变量，可以为数字，字符串|这是angular中非常重要的一个指令与input,textarea和select标签一起使用，实现angular的双向数据绑定|
|ng-if|ng-if="value" value可以为布尔值，也可以是一个三运算，只要最后得到的为布尔值就可以了，如果为true则删除整个节点|这个指令也可以用来diy组件的模版，根据自定义的模板名字，通常我会用channel来写模版的名字|
|ng-show|ng-show="同上" 为true则显示节点，否则隐藏节点，不会删除节点|也可用来diy组将模板|
|ng-hide|ng-hide="同上" 作用与ng-show相反|也可用来diy组件模版|

#### 自定义指令/组件
- 自定义指令的写法
```
app.directive('ngColor',function(){
     return {
          link:function(scope,ele,attr){
               ele.css('color',attr.ngColor);
          }
     }
});
```
通常自定义的指令只会用到link，通过link来创建这个指令独有的方法，与节点绑定在一起，使节点拥有某个功能，例如滑动指令，ngTouch
- 自定义组件的写法
```
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


## 常见解决问题的方法

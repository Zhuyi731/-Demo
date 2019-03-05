# 浅谈前端路由
现有的主流前端框架(ng,Vue,React)中，都实现了对应的路由组件。     
在较新的浏览器中，可以通过history api来实现。  
在较老的浏览器中，可以通过监听hashchange事件来实现。  

下文将实现一个基于hashchange的简单路由  
 demo代码 [https://github.com/Zhuyi731/Web-Router-Demo/blob/master/index.js](https://github.com/Zhuyi731/Web-Router-Demo/blob/master/index.js)   
demo演示地址 [https://zhuyi731.github.io/Web-Router-Demo/](https://Zhuyi731.github.io/Web-Router-Demo/)

## HistoryAPI  
[浏览器兼容情况查看](https://caniuse.com/#search=history) (IE10+支持)   

History API中，用于路由的主要有3个方法。  

* popState  
* pushState 
* replaceState 

### popState  
先说popState，popState是一个事件。  
当用户点击浏览器的前进，后退按钮时触发。  
或者当js调用history.back() history.go()时触发;  

**注意： history.pushState() 和 history.replaceState()并不会触发该事件**

```js  
window.onpopstate = function(e) {
    console.log(e.state);
};

window.addEvenetListener("popstate", function(e) {
    console.log(e.state)
}, false);
```

### pushState
pushState会向浏览器历史记录中压入一条记录。并且替换当前的URL，不会刷新页面。

**window.history.pushState(stateObj, title, URL);**

接受三个参数    
stateObj: state对象，当用户通过后退，前进键进入这个URL时，能获得这个state对象。  
title: 现在暂时没有用。一般传null即可。  
URL：需要压入的浏览器历史记录URL。   

### replaceState
replaceState同pushState一样，不过replaceState是替换当前的历史记录。


## hash
URL分为多个部分，位于#号以后的部分称作hash。  
在js中可以通过window.location.hash获取到hash。     

当hash改变时，页面不刷新，触发hashchange事件。  
并且hashchange事件兼容性很好。IE8+及主流浏览器都支持此事件。  
IE8以下的浏览器可以通过定时轮询来模拟。     

## hashchange事件

规范:HTML5   
接口:HashChangeEvent  
是否冒泡:是  
能否取消默认行为:不能  

HashEvent包含两个属性    
**oldURL**：原有URL    
**newURL**：新的URL    

**注意**: **IE8及Firefox 6以下的版本是没有这两个属性的。**  


## 事件监听

````js
 if ( window.addEventListener ) {  
    window.addEventListener("hashchange", handler, false);    
 } else { //兼容IE  
    window.attachEvent("onhashchange", handler, false);  
 }  
 
 var oldHash ,  
       newHash = window.location.hash;  
 
 function handler(hashChangeEvent){  
    //如果不需要兼容旧版本浏览器   
    //可以通过hashChangeEvent.oldURL   .newURL来获取URL信息   
    //如果需要兼容，只能手动获取URL信息    
    
    oldHash = newHash;  
    newHash = window.location.hash.split("#").pop();  
    //newHash = hashChangeEvenet.oldURL.split("#").pop();  
    
    //do something below   
    
 }
``````


## 路由实现   
光是有History API  和 hashchange事件是不足够形成一个完整的路由组件的。  
还需要利用ajax来加载对应的页面(html)和脚本(js)。

下面以hashchange版本的实现来说明一下。
 
### 思路   

项目目录结构：

````

 │  index.html  
 │  index.js  
 │   
 ├─menu1  
 │      menu1.html  
 │      menu1.js  
 │  
 ├─menu2  
 │      menu2.html  
 │      menu2.js  
 │  
 └─menu3    
      menu3.html  
      menu3.js 

```
 
 

 index.html 页面上有三个菜单如下:   
 
````html
<ul id="menu">
    <li><a href="#menu1">菜单1</a></li>
    <li><a href="#menu2">菜单2</a></li>
    <li><a href="#menu3">菜单3</a></li>
</ul>
<div id="content"></div>
```````

预期效果，点击菜单，在id为content的div内展示对应内容并加载对应js脚本。    

**思路**：  
1. 首先,我们需要监听hashchange事件。  
2. 监听到hash变化之后根据对应的hash来决定需要哪些html和js  

**监听hashchange事件**  

``` js  
	if ( window.addEventListener ) {     
	     window.addEventListener("hashchange", function(){     
	        this.handler();     
	     }, false);       
	} else { //兼容IE    
	    window.attachEvent("onhashchange",function(){   
	       this.handler();   
	     }, false);   
	}  
``` 

handler处理函数   

```js
this.oldURL = this.newURL;  
this.newURL = window.location.hash.split("#").pop().split("?")[0];  
var _this = this,  
     url = this.newURL + "/" + this.newURL + ".html",  
     scriptUrl = this.newURL + "/" + this.newURL + ".js";  
       
     this.getHtml(url , function(html) {  //通过ajax获取html  
          document.getElementById("content").innerHTML = html;   
          _this.getScript(scriptUrl, function( ) {  //动态加载js    
                 window.currentPage.init();    //执行js的初始化    
          });  
    });  
``````
其中getHtml为ajax获取html页面函数  
getScript为动态加载js的函数   
具体代码请参见[demo代码](https://github.com/Zhuyi731/Web-Router-Demo/blob/master/index.js)   
demo演示地址  [https://zhuyi731.github.io/Web-Router-Demo/](https://Zhuyi731.github.io/Web-Router-Demo/)




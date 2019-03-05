window.pages = {};
window.currentPage = {};

function Main(){

	this.routerCfg = {};

 	this.init = function(){
 		this.register();
 	}

 	this.register = function(){
 		var _this = this;
 		if ( window.addEventListener ) {
   			 window.addEventListener("hashchange", function(){
   			 	_this.handler();
   			 }, false);  
 		} else { //兼容IE
    		window.attachEvent("onhashchange",function(){
   			 	_this.handler();
   			 }, false);
 		}
 	}

 	this.handler = function(){
 		this.oldURL = this.newURL;
 		this.newURL = window.location.hash.split("#").pop().split("?")[0];
 		this.loadPage();
 	}

 	this.loadPage = function(){
 		//获取html页面
 		var _this = this,
	 		url = this.newURL + "/" + this.newURL + ".html",
	 		scriptUrl = this.newURL + "/" + this.newURL + ".js";
 		this.get(url , function(html){
 			document.getElementById("content").innerHTML = html; 
 			_this.getScript(scriptUrl,function(){
 				window.currentPage.init();
 			});
 		});
 	}

 	this.getScript = function(url, callback){
 		var script=document.createElement('script');
		script.type="text/javascript";
		 
		if(script.readyState) {
			script.onreadystatechange=function(){
				if(script.readyState == "loaded" || script.readyState == "complete"){
				 	script.onreadystatechange=null;
				  	callback();
				}
			}
		}else {
			script.onload = function(){
			  callback();
			}
		}

		script.src = url;
		document.body.appendChild(script);
 	}

 	//ajax get
 	this.get = function(url,cb){
 		var xmlhttp ;
 		if(window.XMLHttpRequest){
 			xmlhttp = new XMLHttpRequest();
 		}else{
 			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 		}
 		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {// 4 = "loaded"
				cb(xmlhttp.responseText);			   		 
	   		} 
 		};
  		xmlhttp.open("GET",url,true);
  		xmlhttp.send(null);
 	}
 }

 var main = new Main();
 main.init();
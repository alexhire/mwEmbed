(function(){

    /** JSON2 **/
        "object"!=typeof JSON&&(JSON={}),function(){"use strict"
        function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t]
            return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,i=e[t]
            switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i)
                case"number":return isFinite(i)?i+"":"null"
                case"boolean":case"null":return i+""
                case"object":if(!i)return"null"
                    if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,r=0;f>r;r+=1)u[r]=str(r,i)||"null"
                        return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
                else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&u.push(quote(n)+(gap?": ":":")+o))
                    return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()})
        var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep
        "function"!=typeof JSON.stringify&&(JSON.stringify=function(t,e,r){var n
            if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" "
            else"string"==typeof r&&(indent=r)
            if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify")
            return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e]
            if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r])
            return reviver.call(t,e,o)}var j
            if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j
            throw new SyntaxError("JSON.parse")})}()
    /** END JSON2 **/

    /** POST MESSAGE START **/
    // everything is wrapped in the XD function to reduce namespace collisions
    var XD = function(){

        var interval_id,
            last_hash,
            cache_bust = 1,
            attached_callback,
            window = this;

        return {
            postMessage : function(message, target_url, target) {
                if (!target_url) {
                    return;
                }
                target = target || parent;  // default to parent
                if (window['postMessage']) {
                    // the browser supports window.postMessage, so call it with a targetOrigin
                    // set appropriately, based on the target_url parameter.
                    target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
                } else if (target_url) {
                    // the browser does not support window.postMessage, so use the window.location.hash fragment hack
                    target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
                }
            },
            receiveMessage : function(callback, source_origin) {
                // browser supports window.postMessage
                if (window['postMessage']) {
                    // bind the callback to the actual event associated with window.postMessage
                    if (callback) {
                        attached_callback = function(e) {
                            if ((typeof source_origin === 'string' && e.origin !== source_origin)
                                || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                                return !1;
                            }
                            callback(e);
                        };
                    }
                    if (window['addEventListener']) {
                        window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                    } else {
                        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                    }
                } else {
                    // a polling loop is started & callback is called whenever the location.hash changes
                    interval_id && clearInterval(interval_id);
                    interval_id = null;
                    if (callback) {
                        interval_id = setInterval(function() {
                            var hash = document.location.hash,
                                re = /^#?\d+&/;
                            if (hash !== last_hash && re.test(hash)) {
                                last_hash = hash;
                                callback({data: hash.replace(re, '')});
                            }
                        }, 100);
                    }
                }
            }
        };
    }();
    /** POST MESSAGE END **/


    if(!kWidget.cielo24LoadedTranscriptions) {
        kWidget.cielo24LoadedTranscriptions = true;

        XD.receiveMessage(function(message){
            try {
                var messageObj = JSON.parse(message.data);
                if(typeof(messageObj.event)!='undefined') {
                    switch(messageObj.event) {
                        case 'playerUpdatePlayhead':
                            //console.log("NEWTIME: "+messageObj.time);
                            var kdp = document.getElementById( messageObj.playerId );
                            kdp.sendNotification('doPlay');
                            kdp.sendNotification('doSeek', messageObj.time);
                            break;
                        case 'toggleVisibilityState':
                            var kdp = document.getElementById( messageObj.playerId );
                            kdp.toggleVisibilityState(messageObj.playerId);
                            break;
                        default :
                            //console.log("Unknown event received: "+messageObj.event);
                            break;
                    }
                }
                //console.log(messageObj);
            }catch(e) {
                //console.log("ERROR: "+e);
            }
        });
    }


	kWidget.addReadyCallback( function( playerId ){

        //
        //if(!kWidget.cielo24LoadedTranscriptions[playerId]) {
        //    kWidget.cielo24LoadedTranscriptions[playerId] = true;

            var playheadPositionCache = 0;
            var widgetPage;

            var ifr;
            var kdp = document.getElementById( playerId );
            var ks = kdp.evaluate("{configProxy.flashvars.ks}");
            var widgetTitle = kdp.evaluate("{cielo24Transcriptions.DynaTransWindowTitle}");
            var widgetNormalHeight = kdp.evaluate("{cielo24Transcriptions.DynaTransWindowSize}");
            if(typeof(widgetNormalHeight)=='undefined') {
                widgetNormalHeight = 435;
            }

            var clientLogo = kdp.evaluate("{cielo24Transcriptions.DynaTransClientLogo}");
            var hideGear = kdp.evaluate("{cielo24Transcriptions.DynaTransHideGear}");
            var hideShare = kdp.evaluate("{cielo24Transcriptions.DynaTransHideShare}");
            var hidePrint = kdp.evaluate("{cielo24Transcriptions.DynaTransHidePrint}");
            var hideDownload = kdp.evaluate("{cielo24Transcriptions.DynaTransHideDownload}");
            var hideLeftMenu = kdp.evaluate("{cielo24Transcriptions.DynaTransHideLeftMenu}");
            var hideSpeakers = kdp.evaluate("{cielo24Transcriptions.DynaTransHideSpeakers}");
            var hideTimestamps = kdp.evaluate("{cielo24Transcriptions.DynaTransHideTimestamps}");
            var autoscrollOff = kdp.evaluate("{cielo24Transcriptions.DynaTransAutoscrollOff}");

            var onPageJs1 = window.location.href;

            var onPageJs1Link = document.createElement('a');
            onPageJs1Link.href = onPageJs1;

            var projectFolderUrlPath = onPageJs1Link.pathname.substr(0, onPageJs1Link.pathname.lastIndexOf("/"));
            if(projectFolderUrlPath.substr(0,1)!='/') {
                projectFolderUrlPath = '/'+projectFolderUrlPath;
            }

            var projectFolderUrl = onPageJs1Link.protocol+"//"+onPageJs1Link.hostname+(onPageJs1Link.port!=""?":"+onPageJs1Link.port:"")+projectFolderUrlPath;

            widgetPage = projectFolderUrl + '/widget.html';

            kdp.addJsListener("entryReady", function(entry) {

                var partnerId = kdp.evaluate("{configProxy.kw.partnerId}");


                var iframeWrapperId = 'cielo24-iframe-wrapper-'+playerId;
                var iframeWrapper = document.getElementById(iframeWrapperId);
                if(iframeWrapper!=null) {
                    iframeWrapper.parentNode.removeChild(iframeWrapper);
                }

                var div = document.createElement('div');
                div.setAttribute('id', iframeWrapperId);
                div.style.width = kdp.style.width;
                div.style.height = widgetNormalHeight+'px';
                div.style.marginTop = '10px';

                ifr = document.createElement('iframe');

                var iframe_style = "overflow: hidden; margin: 0; padding: 0;";
                var ifattr = {
                    width: '100%', height: '100%', 'scrolling': 'no', 'marginWidth': 0,
                    'marginHeight': 0, 'noResize': 0, 'border': 0, 'frameBorder': 0, 'frameSpacing': 0,
                    'background': 'transparent', 'allowTransparency': 'allowTransparency',
                    'style':iframe_style, clear: 'both'
                };

                for (var i in ifattr) {
                    ifr.setAttribute(i, ifattr[i]);
                }
                var ifrSrc = widgetPage+"?ks="+ks;
                ifrSrc += "&partnerId="+encodeURIComponent(partnerId);
                ifrSrc += "&playerId="+encodeURIComponent(playerId);
                ifrSrc += "&widgetTitle="+encodeURIComponent(widgetTitle);
                ifrSrc += "&vdr="+parseInt(entry.duration)*1000;
                ifrSrc += "&clientLogo="+encodeURIComponent(clientLogo);
                ifrSrc += "&entryId="+encodeURIComponent(entry.id);
                ifrSrc += "&hideGear="+encodeURIComponent(hideGear);
                ifrSrc += "&hideShare="+encodeURIComponent(hideShare);
                ifrSrc += "&hidePrint="+encodeURIComponent(hidePrint);
                ifrSrc += "&hideDownload="+encodeURIComponent(hideDownload);
                ifrSrc += "&hideLeftMenu="+encodeURI(hideLeftMenu);
                ifrSrc += "&hideSpeakers="+encodeURIComponent(hideSpeakers);
                ifrSrc += "&hideTimestamps="+encodeURIComponent(hideTimestamps);
                ifrSrc += "&autoscrollOff="+encodeURIComponent(autoscrollOff);

                ifr.src = ifrSrc;

                div.appendChild(ifr);

                kdp.parentNode.insertBefore(div, kdp.nextSibling);

                kdp.kBind( 'playerUpdatePlayhead', onPlayerUpdatePlayhead );
            });

            kdp.addJsListener("entryFailed", function() {

            });

            kdp.toggleVisibilityState = function(playerId) {
                var wrapperDiv = document.getElementById('cielo24-iframe-wrapper-'+playerId);
                if(wrapperDiv.style.height=='45px') {
                    wrapperDiv.style.height = widgetNormalHeight+'px';
                }else {
                    wrapperDiv.style.height = "45px";
                }
            };

            function onPlayerUpdatePlayhead(time){
                var diff = Math.abs(playheadPositionCache-time);
                if(diff>0.1) {
                    playheadPositionCache = time;
                    var jsonData = JSON.stringify({event: 'playerUpdatePlayhead', time: time});
                    XD.postMessage(jsonData, widgetPage, ifr.contentWindow);
                }
            }

        //}

	});

})();



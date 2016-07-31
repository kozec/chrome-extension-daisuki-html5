/**
 * Runs on background and adds fake 'Access-Control-Allow-Origin' header to
 * selected responses. This allows HTML5 player to load subtitles from another
 * domain.
 * 
 * Affected responses are:
 * - From b-ch.com domain, if url ends with ".xml"
 */

var responseListener = function(details){
	/** Handles what's described on top */
	var url = details.url;
	
	if (url.endsWith(".xml") && (url.indexOf("b-ch.com/") !== -1)) { /* original subtitles */
		var flag = false,
		rule = {
				"name": "Access-Control-Allow-Origin",
				"value": "*"
			};

		for (var i = 0; i < details.responseHeaders.length; ++i) {
			if (details.responseHeaders[i].name.toLowerCase() === rule.name.toLowerCase()) {
				flag = true;
				details.responseHeaders[i].value = rule.value;
				break;
			}
		}
		if(!flag) details.responseHeaders.push(rule);
	}
	
	return {responseHeaders: details.responseHeaders};
};


chrome.runtime.onInstalled.addListener(function(){
	/** Installs HeadersReceived listener */
	chrome.webRequest.onHeadersReceived.removeListener(responseListener);
	chrome.webRequest.onHeadersReceived.addListener(responseListener, { urls: ['http://*/*', 'https://*/*'] }, ["blocking", "responseHeaders"]);
});

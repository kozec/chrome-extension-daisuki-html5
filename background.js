var responseListener = function(details){
	var url = details.url;
	
	if (
		(url.endsWith(".xml") && (url.indexOf("b-ch.com") !== -1) ) /* original subtitles */
		||
		(url.endsWith(".srt") || url.endsWith(".vtt")) /* supported 3rd party subtitles */
	) {
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

/*On install*/
chrome.runtime.onInstalled.addListener(function(){
	chrome.webRequest.onHeadersReceived.removeListener(responseListener);
	chrome.webRequest.onHeadersReceived.addListener(responseListener, { urls: ['http://*/*', 'https://*/*'] }, ["blocking", "responseHeaders"]);
});

var s = document.createElement('link');
s.rel = "stylesheet";
s.href = chrome.extension.getURL('skin/minimalist.css');
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('link');
s.rel = "stylesheet";
s.href = chrome.extension.getURL('subtitles.css');
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('script');
s.src = chrome.extension.getURL('flowplayer.min.js');
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('script');
s.src = chrome.extension.getURL('flowplayer.hlsjs.min.js');
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
(document.head || document.documentElement).appendChild(s);

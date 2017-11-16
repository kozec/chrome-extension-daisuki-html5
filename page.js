/**
 * All required scripts are injected into page to have access
 * to actual page context.
 */

// CSS

var s = document.createElement('link');
s.rel = "stylesheet";
s.href = "//releases.flowplayer.org/7.0.1/skin/skin.css";
(document.head || document.documentElement).appendChild(s);

s = document.createElement('link');
s.rel = "stylesheet";
s.href = chrome.extension.getURL('subtitles.css');
(document.head || document.documentElement).appendChild(s);


// JS

s = document.createElement('script');
s.src = "//releases.flowplayer.org/7.0.1/flowplayer.min.js";
(document.head || document.documentElement).appendChild(s);

s = document.createElement('script');
s.src = "//releases.flowplayer.org/hlsjs/1.1.1/flowplayer.hlsjs.min.js";
(document.head || document.documentElement).appendChild(s);

s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
(document.head || document.documentElement).appendChild(s);

function createPlayer(url, type, subtitles) {
	var m = document.getElementById("movieArea");
	while (m.firstChild)
		m.removeChild(m.firstChild);
	
	flowplayer("#movieArea", {
		clip: {
			sources: [
				{ type: type, src: url },
			],
			subtitles : subtitles,
		},
		subtitleParser: xmlSubtitleParser,
		embed : false,
	});
}

function seconds(timecode) {
	var els = timecode.split(':');
	if (els.length == 2) els.unshift(0);
	return els[0] * 60 * 60 + els[1] * 60 + parseFloat(els[2].replace(',','.'));
}


function srtSubtitleParser(txt) {
	var TIMECODE_RE = /^(([0-9]{1,2}:){1,2}[0-9]{2}[,.][0-9]{3}) --\> (([0-9]{1,2}:){1,2}[0-9]{2}[,.][0-9]{3})(.*)/;
	
	function seconds(timecode) {
		var els = timecode.split(':');
		if (els.length == 2) els.unshift(0);
			return els[0] * 60 * 60 + els[1] * 60 + parseFloat(els[2].replace(',','.'));
	}
	
	var entries = [];
	for (var i = 0, lines = txt.split("\n"), len = lines.length, entry = {}, title, timecode, text, cue; i < len; i++) {
		timecode = TIMECODE_RE.exec(lines[i]);
		if (timecode) {
			// title
			title = lines[i - 1];
			
			// text
			text = "<p>" + lines[++i] + "</p><br/>";
			while (typeof lines[++i] === 'string' && lines[i].trim() && i < lines.length)
				text +=  "<p>" + lines[i] + "</p><br/>";
			
			// entry
			entry = {
				title: title,
				startTime: seconds(timecode[1]),
				endTime: seconds(timecode[3]),
				text: text
			};
		entries.push(entry);
		}
	}
	return entries;
};

function xmlSubtitleParser(txt) {
	var xml;
	try {
		xml = $($.parseXML(txt));
	} catch (e) {
		// Not XML - parse as srt/vtt
		return srtSubtitleParser(txt);
	}
	var subs = [];
	var i = 1;
	xml.find("p").each(function() {
		text = $(this).text().replace(/^\s+|\s+$/g, '');
		
		subs.push({
			title: i,
			startTime: seconds(this.attributes.begin.value),
			endTime: seconds(this.attributes.end.value),
			text: "<p>" + text.replace("\n", "<br/>") + "</p>"
		});
	});
	
	console.log(subs[0]);
	
	return subs;
}


$(document).ready(function() {
	var m = document.getElementById("movie");
	var s = m.getElementsByTagName("script")[0].text;
	eval(s.substring(0, s.indexOf("swfobject")));
	
	var hash = location.hash.replace('#', '');
	var params = hash.split('&');
	var hashparams = {};
	for(var i = 0; i < params.length; i++){
		var propval = params[i].split('=');
		hashparams[propval[0]] = decodeURIComponent(propval[1]);
	}
	
	console.log(hashparams);
	
	api_params = {
		"device_cd": flashvars["device_cd"],
		"ss_id": flashvars["ss_id"],
		"mv_id": flashvars["mv_id"],
		"ss1_prm": flashvars["ss1_prm"],
		"ss2_prm": flashvars["ss2_prm"],
		"ss3_prm": flashvars["ss3_prm"],
	};
	
	params = {
		"s": flashvars["s"],
		"c": "SK",
		"e": location.href,
		"d": window.bgnEncrypt(api_params),
		"a": window.bgnGetKey(),
	};
	
	
	$.get("http://www.daisuki.net" + flashvars['init'], params, function(data) {
		init_data = window.bgnDecrypt(data.rtn);
		console.log(init_data);
		
		$.get(init_data.play_url, function(data) {
			window.playlist_data = data;
			var p = data.split("\n");
			var url = p.pop();
			while (url === "") url = p.pop();
			
			var subs = [];
			if (init_data.caption_url) {
				// Assuming here, it may get updated if daisuki even changes
				subs = [ { kind:"subtitles", "default":true,
					srclang: "en", label: "English",
					src: init_data.caption_url } ];
			}
			
			if (hashparams.sub) {
				console.log(hashparams);
				for(var i = 0; i < subs.length; i++)
					subs[i]["default"] = false;
				var lang = hashparams.lang || "unk";
				var label = hashparams.label || "Unknown";
				subs.push({ kind:"subtitles", "default":true,
					srclang: lang, label: label,
					src: hashparams.sub }
				);
			}
			
			console.log(url);
			console.log(subs);
			
			createPlayer(url, "application/x-mpegURL", subs);
			
		});
	});
	
	
	var div = document.createElement("div");
	var sub = document.createElement("p");
	div.className = "flowplayer fp-subtitle";
	sub.innerHTML = "normal subtitle";
	div.appendChild(sub);
	document.body.appendChild(div);
	
	div = document.createElement("div");
	sub = document.createElement("p");
	div.className = "flowplayer is-fullscreen fp-subtitle";
	sub.innerHTML = "normal subtitle";
	div.appendChild(sub);
	document.body.appendChild(div);

});

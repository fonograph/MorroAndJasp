var sox = require('sox-audio');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var script = require('./src/script.json').slice(1); // skip version #

function processDir(path, outPath, char, lines, beat, callback) {
	try { 
		var files = fs.readdirSync(path);
	}
	catch (e) {
		callback();
		return;
	}
	try {
		fs.readdirSync(outPath);
	}
	catch (e) {
		mkdirp.sync(outPath);
	}

	var i = -1;
	var nextFile = function() {
		i++;
		if ( i < files.length ) {
			var file = files[i];
			if ( file.substr(-4) == '.aif' || file.substr(-5) == '.aiff' || file.substr(-4) == '.wav' ) {
				processFile(path, outPath, file, 'mp3',  char, lines, beat, ()=>{
					processFile(path, outPath, file, 'ogg',  char, lines, beat, nextFile);
				});
			} 
			else {
				nextFile();
			}
		} else {
			callback();
		}
	}
	nextFile();
}

function processFile(path, outPath, file, ext, char, lines, beat, callback) {
	callback = callback || function(){};

	var outFile = file.replace(/ /g,'-').replace('.aiff', '.'+ext).replace('.aif', '.'+ext).replace('.wav', '.'+ext);
	var command = new sox()
		.global(['--norm=3'])
		.input(path+'/'+file)
		.output(outPath+'/'+outFile)
		.outputFileType(ext)
		.outputChannels(1);		

	if ( isFileAThought(outFile, char, lines) ) {
		command.addEffect('reverb');
	}
	if ( char == 'x' && !['intermission opening', 'tv executive', 'celebration', 'food', 'drink', 'breakdown', 'blame game', 'end of intermission', 'they escape', 'outside disaster', 'intermission fight', 'thelma and louise'].includes(beat) ) {
		command.addEffect('reverb', [40]);
		command.addEffect('highpass', [300]);
	}

	command
		.addEffect('reverse')
		.addEffect('silence', [1,5,'0.01%'])
		.addEffect('reverse')
		.addEffect('silence', [1,5,'0.01%']);

	if ( ext == 'mp3' ) {
		command.outputBitrate('64');
	}

	command.on('end', callback);
	command.on('error', function(err, stdout, stderr) {
			console.log('Cannot process audio: ' + err.message);
			console.log('Sox Command Stdout: ', stdout);
			console.log('Sox Command Stderr: ', stderr)
			callback();
	});

	// command.on('start', function(commandLine) {console.log('Spawned sox with command ' + commandLine); });

	command.run();
}

function isFileAThought(file, char, lines) {
	file = file.substr(0, file.length-4);
	var match = null;
	lines.forEach((line)=>{
		if ( line.char == char && line.text.indexOf(file) === 0 && ( !match || match.length > line.text.length )) {
			match = line;
		}
	});
	if ( !match ) {
		console.log("Could not find line for file: " + file);
		return false;
	}
	return match.isThought;
}

function getLinesInBeat(container) {
	if ( container.type === 'Line' ) {
		return {
			char: container.char, 
			text: container.text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-'),
			isThought: container.text.trim().substr(0, 1) == '(' && container.text.trim().substr(-1) == ')'
		};
	}

	var res = [];
	_.each(container, (child)=>{
		if ( _.isObject(child) || _.isArray(child) ) {
			res = res.concat(getLinesInBeat(child));
		}
	});
	return res;
}

function getBeat(beat) {
	var res = null;
	script.forEach((obj)=>{
		if ( obj.beat.name.replace('/', ' ') === beat ) {
			res = obj.beat;
		}
	});
	return res;
}

var i = -1;
var beats = fs.readdirSync('./src/assets/audio/beats');
var onlyBeat = process.argv.length == 3 ? process.argv[2] : null;
var processNextBeat = function() {
	i++;
	if ( i < beats.length ) {
		var beat = beats[i];
		var stat = fs.statSync('./src/assets/audio/beats/'+beat);
		if ( stat.isDirectory() && !(!!onlyBeat && onlyBeat != beat) ) {
			let lines = getLinesInBeat(getBeat(beat));
			// console.log(lines);
			processDir('./src/assets/audio/beats/'+beat+'/m', './www/assets/audio/beats/'+beat+'/m', 'm', lines, beat, ()=>{
				processDir('./src/assets/audio/beats/'+beat+'/j', './www/assets/audio/beats/'+beat+'/j', 'j', lines, beat, ()=>{
					processDir('./src/assets/audio/beats/'+beat+'/x', './www/assets/audio/beats/'+beat+'/x', 'x', lines, beat, processNextBeat);
				});
			});
		}
		else {
			processNextBeat();
		}
	}
}
processNextBeat();

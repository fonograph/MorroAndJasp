var sox = require('sox-audio');
var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var script = require('./src/script.json');

function processDir(path, outPath, char, thoughts, callback) {
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
			if ( file.substr(-4) == '.aif' || file.substr(-5) == '.aiff' ) {
				processFile(path, outPath, file, 'mp3',  char, thoughts, ()=>{
					processFile(path, outPath, file, 'ogg',  char, thoughts,  nextFile);
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

function processFile(path, outPath, file, ext, char, thoughts, callback) {
	callback = callback || function(){};

	var outFile = file.replace(/ /g,'-').replace('.aiff', '.'+ext).replace('.aif', '.'+ext);
	var command = new sox()
		.global(['--norm=3'])
		.input(path+'/'+file)
		.output(outPath+'/'+outFile)
		.outputFileType(ext)
		.outputChannels(1);		

	if ( isFileInThoughts(outFile, char, thoughts) ) {
		command.addEffect('reverb');
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

function isFileInThoughts(file, char, thoughts) {
	file = file.substr(0, file.length-4);
	var res = false;
	thoughts.forEach((thought)=>{
		if ( thought.char == char && thought.text.indexOf(file) === 0 ) {
			res = true;
		}
	});
	return res;
}

function getThoughtsInBeat(container) {
	if ( container.type === 'Line' ) {
		if ( container.text.trim().substr(0, 1) == '(' && container.text.trim().substr(-1) == ')' ) {
			return {char: container.char, text:container.text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-')};
		}
	}

	var res = [];
	_.each(container, (child)=>{
		if ( _.isObject(child) || _.isArray(child) ) {
			res = res.concat(getThoughtsInBeat(child));
		}
	});
	return res;
}

function getBeat(beat) {
	var res = null;
	script.forEach((obj)=>{
		if ( obj.beat.name === beat ) {
			res = obj.beat;
		}
	});
	return res;
}

var i = -1;
var beats = fs.readdirSync('./src/assets/audio/beats');
var processNextBeat = function() {
	i++;
	if ( i < beats.length ) {
		var beat = beats[i];
		var stat = fs.statSync('./src/assets/audio/beats/'+beat);
		if ( stat.isDirectory() ) {
			let thoughts = getThoughtsInBeat(getBeat(beat));
			processDir('./src/assets/audio/beats/'+beat+'/m', './www/assets/audio/beats/'+beat+'/m', 'm', thoughts, ()=>{
				processDir('./src/assets/audio/beats/'+beat+'/j', './www/assets/audio/beats/'+beat+'/j', 'j', thoughts, ()=>{
					processDir('./src/assets/audio/beats/'+beat+'/x', './www/assets/audio/beats/'+beat+'/x', 'x', thoughts, processNextBeat);
				});
			});
		}
		else {
			processNextBeat();
		}
	}
}
processNextBeat();

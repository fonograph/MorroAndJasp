var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var newer = require('gulp-newer');
var bump = require('gulp-bump');
var replace = require('gulp-replace');
var fs = require('fs');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var less = require('gulp-less');
var ffmpeg = require('gulp-fluent-ffmpeg');
var rename = require("gulp-rename");
var assetManifest = require('gulp-asset-manifest');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegrecompress = require('imagemin-jpeg-recompress');
var manifest = require('gulp-manifest');
var es = require('event-stream');
var runSequence = require('run-sequence');
var rm = require('gulp-rimraf');
var del = require('del');
var plumber = require('gulp-plumber');
var replace = require('gulp-replace');



function handleError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('copy', function(){
    return gulp.src(['src/*.html', 'src/**/*.css', 'src/**/credits.txt'])
        .pipe(gulp.dest('www'));
});

gulp.task('less', function(){
    return gulp.src(['src/**/*.less'])
        .pipe(newer({dest:'www', ext:'.css'}))
        .pipe(less())
        .pipe(gulp.dest('www'))
        .pipe(notify({message:'LESS copied!', onLast:true}))
        .pipe(livereload());
});

gulp.task('fonts', function(){
    return gulp.src(['src/assets/fonts/**/*.*'])
        .pipe(newer('www/assets/fonts'))
        .pipe(gulp.dest('www/assets/fonts'))
        .pipe(notify({message:'Font copied!', onLast:true}));
});

gulp.task('js', function(){
    return gulp.src(['src/**/*.js', 'src/**/*.json'])
        .pipe(newer('www'))
        .pipe(gulp.dest('www'))
        .pipe(notify({message:'JS copied!', onLast:true}));
});


gulp.task('images', function(){
    return gulp.src(['src/assets/**/*.png', 'src/assets/**/*.jpg'])
        .pipe(newer('www/assets'))
        .pipe(imagemin([
            pngquant({quality: '90-100', speed: 3}),
            jpegrecompress({quality: 'veryhigh', accurate: true})
        ], {verbose: true}))
        .pipe(gulp.dest('www/assets'));
});

gulp.task('videos', function(){
    return gulp.src(['src/assets/videos/*.*'])
        .pipe(newer('www/assets/videos'))
        .pipe(gulp.dest('www/assets/videos'));
});

function audio(format, codec) {
    return gulp.src(['src/assets/audio/**/*.{wav,aiff,aif}', '!src/assets/audio/beats/**/*.*'])
        .pipe(newer({dest:'www/assets/audio', ext:'.'+format}))
        .pipe(ffmpeg(format, function (cmd) {
            return cmd
                .audioBitrate('128k')
                .audioChannels(1)
                .audioCodec(codec)
        }))
        .on('error', handleError)
        .pipe(rename(function(path){
            path.basename = path.basename.replace(/ /g,'-')
        }))
        .pipe(gulp.dest('www/assets/audio'))
}

gulp.task('audio', function(){
    return es.merge(audio('mp3', 'libmp3lame'), audio('ogg', 'libvorbis'));
});

gulp.task('audio-manifest', function(){
    return gulp.src(['www/assets/audio/**/*.ogg'])
        .pipe(assetManifest({bundleName: 'audio', includeRelativePath: true, manifestFile: 'www/assets/audio/manifest.json'}));
});

gulp.task('animations-manifest', function(){
    return gulp.src(['www/assets/characters/*/*.json'])
        .pipe(rename({extname:''}))
        .pipe(assetManifest({bundleName: 'animations', manifestFile: 'www/assets/characters/manifest.json'}));
});

gulp.task('backdrops-manifest', function(){
    return gulp.src(['www/assets/img/backdrops/*.png'])
        .pipe(rename({extname:''}))
        .pipe(assetManifest({bundleName: 'backdrops', manifestFile: 'www/assets/img/backdrops/manifest.json'}));
});

gulp.task('config:release', function(){
    gulp.src(['www/js/Config.js'])
        .pipe(replace(/environment: ['"]\w+['"]/g, "environment: 'production'"))
        .pipe(gulp.dest('www/js'));
});

gulp.task('clean', function(){
    return del(['www/*.*', 'www/bower_components', 'www/css', 'www/js', 'www/assets/audio/*', 'www/assets/characters', 'www/assets/fonts', 'www/assets/img', 'www/assets/videos', '!www/assets/audio/beats']);
});

gulp.task('watch', function() {
    livereload.listen();
    watch(['src/**/*.less'], function(){ gulp.start('less'); });
    watch(['src/**/*.js', 'src/**/*.json'], function(){ gulp.start('js'); });
});

gulp.task('build', function(callback){ runSequence(['copy', 'less', 'fonts', 'js', 'images', 'videos', 'audio'], ['audio-manifest', 'animations-manifest', 'backdrops-manifest'], callback) });
gulp.task('build:release', function(callback){ runSequence(['copy', 'less', 'fonts', 'js', 'images', 'videos', 'audio'], ['audio-manifest', 'animations-manifest', 'backdrops-manifest', 'config:release'], callback) });

//
//gulp.task('scripts', function(){
//    return gulp.src('src/js/setup.js')
//        .pipe(sourcemaps.init())
//        .pipe(requirejsOptimize({
//            baseUrl: 'src/js',
//            mainConfigFile: 'src/js/setup.js',
//            name: 'setup',
//            optimize: 'none',
//            generateSourceMaps: true,
//            //optimizeAllPluginResources: true,
//            //findNestedDependencies: true,
//            logLevel: 0,
//            useStrict: true,
//            preserveLicenseComments: false
//        }))
//        .on('error', handleError)
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest('www'));
//});


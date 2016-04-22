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
var manifest = require('gulp-manifest');



function handleError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('bump', function(){
    return gulp.src('./version.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('version', ['bump'], function(){
    var json = JSON.parse(fs.readFileSync('./version.json'));
    return gulp.src('src/*.html')
        .pipe(replace('{VERSION}', json.version))
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

gulp.task('js', function(){
    return gulp.src(['src/**/*.js', 'src/**/*.json'])
        .pipe(newer('www'))
        .pipe(gulp.dest('www'))
        .pipe(notify({message:'JS copied!', onLast:true}));
});

gulp.task('php', function(){
    return gulp.src(['src/php/**/*.php'])
        .pipe(newer('www'))
        .pipe(gulp.dest('www/php'))
        .pipe(notify({message:'PHP copied!', onLast:true}));
});

gulp.task('images', function(){
    return gulp.src(['src/assets/**/*.png', 'src/assets/**/*.jpg'])
        .pipe(imagemin({use: [pngquant({quality: '80-100', speed: 1})], multipass:true}))
        .pipe(gulp.dest('www/assets'));
});

gulp.task('audio', function(){
    return gulp.src(['src/assets/audio/**/*.wav'])
        .pipe(newer({dest:'src', ext:'.mp3'}))
        .pipe(ffmpeg('mp3', function (cmd) {
            return cmd
                .audioBitrate('128k')
                .audioChannels(1)
                .audioCodec('libmp3lame')
        }))
        .on('error', handleError)
        .pipe(rename(function(path){
            path.basename = path.basename.replace(/ /g,'-')
        }))
        .pipe(gulp.dest('www/assets/audio'));
});

gulp.task('preload-manifest', function(){
    return gulp.src(['www/assets/**/*.*', '!www/assets/characters/*.png', '!**/*.wav', '!www/assets/fonts/**/*.*'])
        //.pipe(assetManifest({bundleName: 'assets', includeRelativePath: true, manifestFile: 'www/assets/preload-manifest.json'}))
        .pipe(manifest({
            hash: true,
            prefix: 'assets/',
            network: ['*'],
            filename: 'manifest.appcache',
            exclude: 'manifest.appcache'
        })).
        pipe(gulp.dest('www'));
});

gulp.task('audio-manifest', function(){
    return gulp.src(['www/assets/audio/**/*.mp3'])
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

gulp.task('watch', function() {
    livereload.listen();
    watch(['src/**/*.less'], function(){ gulp.start('less'); });
    watch(['src/**/*.js', 'src/**/*.json'], function(){ gulp.start('js'); });
    watch(['src/php/**/*.php'], function(){ gulp.start('php'); });
});

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


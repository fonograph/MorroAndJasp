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
        .pipe(newer({dest:'dev', ext:'.css'}))
        .pipe(less())
        .pipe(gulp.dest('www'))
        .pipe(notify({message:'LESS copied!', onLast:true}))
        .pipe(livereload());
})

gulp.task('copy', function(){
    return gulp.src(['src/**/*.*', '!src/**/*.less'])
        .pipe(newer('www'))
        .pipe(gulp.dest('www'))
        .pipe(notify({message:'Files copied!', onLast:true}));
});

gulp.task('watch', function() {
    livereload.listen();
    watch(['src/**/*', '!src/**/*.less'], function(){ gulp.start('copy'); });
    watch(['src/**/*.less'], function(){ gulp.start('less'); });
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

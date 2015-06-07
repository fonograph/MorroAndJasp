module.exports = function (grunt) {
    grunt.initConfig({

        image_resize: {
            portraits: {
                options: {
                    width: 640,
                    height: 640,
                    overwrite: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/assets/img/full/',
                        src: '*.png',
                        dest: 'src/assets/img/standard/',
                        rename: function(dest, src){
                            return dest + src.replace('final_','').replace(' copy','').replace('_', '');
                        }
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-image-resize');

    grunt.registerTask('images', ['newer:image_resize']);

    //grunt.registerTask('build', ['requirejs','newer:ffmpeg','newer:copy','newer:imagemin']);
};
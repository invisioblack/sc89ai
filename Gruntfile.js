
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        cwd: 'src/',
                        expand: true,
                        src: ['**'],
                        dest: 'C:/Users/Pikachu/AppData/Local/Screeps/scripts/screeps_sc89_me___21025/default',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['copy']);
}
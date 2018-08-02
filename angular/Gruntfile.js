module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        copy: {
            main: {
                files: [
                { expand: true, src: ['src/**'], dest: 'toTranslate/' }
              ]
            }
        },
        strip_code: {
            options: {
                blocks: [
                    {
                        start_block: '/* translation-unfriendly-code */',
                        end_block: '/* end-translation-unfriendly-code */'
                    }
                ]
            },
            your_target: {
                src: 'toTranslate/**/*.js'
            }
        },
        nggettext_extract: {
            pot: {
                files: {
                    '../django/translations/master.pot': ['./toTranslate/**/*.+(js|html)']
                }
            }
        },
        clean: ['toTranslate']
    });
    grunt.registerTask('default', ['copy', 'strip_code', 'nggettext_extract', 'clean']);
};

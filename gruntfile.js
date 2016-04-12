module.exports = function(grunt) {
    // Configuramos Grunt
    var fecha = new Date();
    var tagVersion = "".concat(fecha.getFullYear(),"-",fecha.getMonth(),"-",fecha.getDate(),".",fecha.getHours(),".",fecha.getMinutes(),".",fecha.getSeconds());
    var commitMessage = "Publicacion automatica "+tagVersion;
    grunt.initConfig({
        less: {
            main: {
                files: {
                    "src/styles/style.css": "src/less/style.less"
                }
            }
        },  
        postcss: {
            options: {
                processors: [
                    require("autoprefixer")(), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            main: {
                src: "src/styles/*.css"
            }
        },      
        clean: ["dist/*"],
        copy:{
            html: {
                expand: true,
                src: ["**/*.html","CNAME","favicon.ico"],
                cwd: 'src/',
                dest: 'dist/',
            },
            styles: {
                expand: true,
                src: '**/*.css',
                cwd: 'src/',
                dest: 'dist/',
            },
            fonts: {
                expand: true,
                src: 'fonts/*.*',
                cwd: 'bower_components/bootstrap',
                dest: 'dist/',
            },			
            libs: {
                expand: true,
                src: 'libs/*.js',
                cwd: 'src/',
                dest: 'dist/',
            }
        },
        //Configuracion para que todos los archivos js se construyan en uno unico
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                  "bower_components/angular/angular.min.js",
                  "src/scripts/**/*.js"
                ],
                dest: "src/libs/app.js"
            }
        },
        //Configuracion del observador de cambios y desencadenamiento de tareas
        watch: {
            options: {
                spawn: true
            },
            less: {
                files: ["src/less/*.less"],
                tasks: ["less", "postcss"]
            },
            css: {
                files: ["src/styles/**/*.css"],
                tasks: ["copy:styles"]          
            },
            applicationjs: {
                files: ["src/scripts/**/*.js"],
                tasks: ["concat"]          
            },
            html: {
                files: ["src/**/*.html"],
                tasks: ["copy:html"]            
            },
            libs: {
                files: ["src/libs/**/*.js"],
                tasks: ["copy:libs"]            
            }           
        },
        //Definicion para publicar en GitHub Pages el contenido del directorio "dist"
        "gh-pages": {
            options: {
                base: "dist",
                tag: tagVersion,
                message: commitMessage
            },
            src: '**/*'
        },
        //Tareas que se pueden realizar concurrentemente.
        concurrent: {
          preparation: [["less", "postcss"],"concat"],
          copy: ["copy:styles", "copy:html", "copy:libs", "copy:fonts"]
        }        
        
    });

    // Cargar módulos de Grunt
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Definimos las tareas disponibles
    grunt.registerTask("default", ["clean", "concurrent:preparation","concurrent:copy", "watch"]);
    grunt.registerTask("publish", ["clean", "concurrent:preparation","concurrent:copy", "gh-pages"]);
};